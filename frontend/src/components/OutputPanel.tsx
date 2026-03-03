import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Check, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { GeneratedEmail } from "@/utils/api";

interface Props {
  email: GeneratedEmail | null;
  loading: boolean;
}

const OutputPanel = ({ email, loading }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!email) return;
    const text = `Subject: ${email.subject}\n\n${email.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: "Email copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-xl p-6">
        <div className="shimmer h-6 w-3/4 rounded-md" />
        <div className="space-y-2">
          <div className="shimmer h-4 w-full rounded-md" />
          <div className="shimmer h-4 w-full rounded-md" />
          <div className="shimmer h-4 w-5/6 rounded-md" />
          <div className="shimmer h-4 w-full rounded-md" />
          <div className="shimmer h-4 w-2/3 rounded-md" />
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-black/30 backdrop-blur-md p-12 text-center">
        <Mail className="mb-4 h-12 w-12 text-white/20" />
        <p className="text-sm text-white/50">Your generated email will appear here.</p>
        <p className="mt-1 text-xs text-white/30">Fill in the form above and hit Generate.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-xl p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/50">Subject</p>
          <h3 className="text-lg font-semibold text-white">{email.subject}</h3>
        </div>
        <Button variant="outline" size="sm" className="border-white/[0.1] text-white/70 hover:bg-white/10 hover:text-white" onClick={handleCopy}>
          {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="whitespace-pre-wrap rounded-lg bg-white/[0.05] p-4 font-mono text-sm leading-relaxed text-white/90">
        {email.body}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(email.metadata).map(([key, value]) => (
          <span key={key} className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-xs text-white/60">
            {key}: {value}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default OutputPanel;
