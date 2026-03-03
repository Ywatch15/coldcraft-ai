import type { GeneratedEmail } from "@/utils/api";
import { Mail } from "lucide-react";

interface Props {
  email: GeneratedEmail;
  selected: boolean;
  onClick: () => void;
}

const EmailCard = ({ email, selected, onClick }: Props) => {
  const timeAgo = getTimeAgo(email.createdAt);

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg p-3 text-left transition-all duration-200 ${
        selected
          ? "border border-indigo-500/30 bg-indigo-500/10"
          : "border border-transparent hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{email.subject}</p>
          <p className="truncate text-xs text-white/50">
            {email.metadata.recipientName} · {email.metadata.company}
          </p>
          <p className="mt-0.5 text-xs text-white/30">{timeAgo}</p>
        </div>
      </div>
    </button>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default EmailCard;
