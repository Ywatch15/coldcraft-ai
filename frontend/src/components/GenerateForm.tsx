import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Loader2, Send, User, Building2, Briefcase, Target, MessageSquare, FileText } from "lucide-react";

export interface EmailFormData {
  recipientName: string;
  company: string;
  role: string;
  goal: string;
  tone: string;
  extraContext: string;
}

const DRAFT_KEY = "coldcraft_draft";

interface Props {
  onGenerate: (data: EmailFormData) => void;
  loading: boolean;
}

const GenerateForm = ({ onGenerate, loading }: Props) => {
  const [form, setForm] = useState<EmailFormData>(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved
      ? JSON.parse(saved)
      : { recipientName: "", company: "", role: "", goal: "", tone: "Professional", extraContext: "" };
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  const update = (field: keyof EmailFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!form.recipientName || !form.company || !form.goal) return;
      onGenerate(form);
    },
    [form, onGenerate]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit]);

  const fieldConfig = [
    { id: "recipientName", label: "Recipient Name", placeholder: "Sarah Chen", icon: User, required: true },
    { id: "company", label: "Company", placeholder: "Stripe", icon: Building2, required: true },
    { id: "role", label: "Role", placeholder: "Head of Partnerships", icon: Briefcase, required: false },
    { id: "goal", label: "Goal", placeholder: "Schedule a demo call", icon: Target, required: true },
  ] as const;

  return (
    <div className="relative rounded-[1.25rem] border-[0.75px] border-white/[0.08] p-2 md:rounded-[1.5rem] md:p-3">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <form
        onSubmit={handleSubmit}
        className="relative space-y-5 rounded-xl border-[0.75px] border-white/[0.08] bg-[#060606] p-6 shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]"
      >
        {/* Form header */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold tracking-[-0.04em] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Compose Your Outreach
          </h3>
          <p className="mt-0.5 text-sm text-white/30" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Fill in the details — AI crafts the email.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fieldConfig.map((field) => (
            <motion.div
              key={field.id}
              className="space-y-1.5"
              animate={{ scale: focusedField === field.id ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Label htmlFor={field.id} className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-white/50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <field.icon className="h-3 w-3 text-indigo-400/70" />
                {field.label} {field.required && <span className="text-rose-400">*</span>}
              </Label>
              <Input
                id={field.id}
                placeholder={field.placeholder}
                value={form[field.id]}
                onChange={(e) => update(field.id, e.target.value)}
                onFocus={() => setFocusedField(field.id)}
                onBlur={() => setFocusedField(null)}
                className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/20 transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="space-y-1.5"
          animate={{ scale: focusedField === "tone" ? 1.01 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Label className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-white/50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <MessageSquare className="h-3 w-3 text-indigo-400/70" />
            Tone
          </Label>
          <Select value={form.tone} onValueChange={(v) => update("tone", v)}>
            <SelectTrigger
              className="border-white/[0.08] bg-white/[0.03] text-white transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
              onFocus={() => setFocusedField("tone")}
              onBlur={() => setFocusedField(null)}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/[0.08] bg-[#0a0a0a] text-white backdrop-blur-xl">
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          className="space-y-1.5"
          animate={{ scale: focusedField === "extraContext" ? 1.01 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Label htmlFor="extraContext" className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-white/50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <FileText className="h-3 w-3 text-indigo-400/70" />
            Extra Context
          </Label>
          <Textarea
            id="extraContext"
            placeholder="Any additional details or talking points..."
            value={form.extraContext}
            onChange={(e) => update("extraContext", e.target.value)}
            onFocus={() => setFocusedField("extraContext")}
            onBlur={() => setFocusedField(null)}
            className="min-h-[80px] border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/20 transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          />
        </motion.div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-semibold tracking-wide hover:opacity-90 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-300"
          disabled={loading || !form.recipientName || !form.company || !form.goal}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          {loading ? "Generating..." : "Generate Email"}
          {!loading && <span className="ml-2 text-xs text-white/60">⌘↵</span>}
        </Button>
      </form>
    </div>
  );
};

export default GenerateForm;
