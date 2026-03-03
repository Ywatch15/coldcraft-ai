import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-xl p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="recipientName" className="text-xs text-white/50">Recipient Name *</Label>
          <Input id="recipientName" placeholder="Sarah Chen" value={form.recipientName} onChange={(e) => update("recipientName", e.target.value)} className="border-white/[0.1] bg-white/[0.05] text-white placeholder:text-white/30 focus:border-indigo-500/50" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-xs text-white/50">Company *</Label>
          <Input id="company" placeholder="Stripe" value={form.company} onChange={(e) => update("company", e.target.value)} className="border-white/[0.1] bg-white/[0.05] text-white placeholder:text-white/30 focus:border-indigo-500/50" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-xs text-white/50">Role</Label>
          <Input id="role" placeholder="Head of Partnerships" value={form.role} onChange={(e) => update("role", e.target.value)} className="border-white/[0.1] bg-white/[0.05] text-white placeholder:text-white/30 focus:border-indigo-500/50" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="goal" className="text-xs text-white/50">Goal *</Label>
          <Input id="goal" placeholder="Schedule a demo call" value={form.goal} onChange={(e) => update("goal", e.target.value)} className="border-white/[0.1] bg-white/[0.05] text-white placeholder:text-white/30 focus:border-indigo-500/50" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-white/50">Tone</Label>
        <Select value={form.tone} onValueChange={(v) => update("tone", v)}>
          <SelectTrigger className="border-white/[0.1] bg-white/[0.05] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-white/[0.1] bg-[#111] text-white">
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Casual">Casual</SelectItem>
            <SelectItem value="Formal">Formal</SelectItem>
            <SelectItem value="Friendly">Friendly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="extraContext" className="text-xs text-white/50">Extra Context</Label>
        <Textarea
          id="extraContext"
          placeholder="Any additional details or talking points..."
          value={form.extraContext}
          onChange={(e) => update("extraContext", e.target.value)}
          className="min-h-[80px] border-white/[0.1] bg-white/[0.05] text-white placeholder:text-white/30 focus:border-indigo-500/50"
        />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90" disabled={loading || !form.recipientName || !form.company || !form.goal}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        {loading ? "Generating..." : "Generate Email"}
        {!loading && <span className="ml-2 text-xs text-white/60">⌘↵</span>}
      </Button>
    </form>
  );
};

export default GenerateForm;
