import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Check, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { GeneratedEmail } from "@/utils/mockData";

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
      <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-6">
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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/30 p-12 text-center">
        <Mail className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Your generated email will appear here.</p>
        <p className="mt-1 text-xs text-muted-foreground/60">Fill in the form above and hit Generate.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl border border-border/50 bg-card/50 p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Subject</p>
          <h3 className="text-lg font-semibold">{email.subject}</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="whitespace-pre-wrap rounded-lg bg-background/50 p-4 font-mono text-sm leading-relaxed text-foreground/90">
        {email.body}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(email.metadata).map(([key, value]) => (
          <span key={key} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
            {key}: {value}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default OutputPanel;
