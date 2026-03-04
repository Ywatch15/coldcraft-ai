import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { emailsAPI, GeneratedEmail } from "@/utils/api";
import GenerateForm, { EmailFormData } from "@/components/GenerateForm";
import OutputPanel from "@/components/OutputPanel";
import EmailCard from "@/components/EmailCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, PanelLeftClose, PanelLeft, LogOut, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { TubesBackground } from "@/components/ui/neon-flow";

const MIN_SIDEBAR = 220;
const MAX_SIDEBAR = 480;
const DEFAULT_SIDEBAR = 300;

const Dashboard = () => {
  const { isAuthenticated, token, logout } = useAuth();
  const navigate = useNavigate();

  const [emails, setEmails] = useState<GeneratedEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<GeneratedEmail | null>(null);
  const [generating, setGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  // Fetch email history on mount
  useEffect(() => {
    if (!token) return;
    emailsAPI
      .getAll(token)
      .then((data) => setEmails(data))
      .catch((err) => console.error("Failed to load emails:", err));
  }, [token]);

  // Sidebar resize drag handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, e.clientX));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startResize = () => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleGenerate = useCallback(async (data: EmailFormData) => {
    if (!token) return;
    setGenerating(true);
    setSelectedEmail(null);

    try {
      const newEmail = await emailsAPI.generate(data, token);
      setEmails((prev) => [newEmail, ...prev]);
      setSelectedEmail(newEmail);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate email";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  }, [token]);

  const handleNewEmail = () => {
    setSelectedEmail(null);
  };

  if (!isAuthenticated) return null;

  return (
    <TubesBackground className="h-screen" enableClickInteraction={true}>
      <div className="flex h-screen pointer-events-auto">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: sidebarWidth, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex h-full flex-col border-r border-white/[0.08] bg-black/40 backdrop-blur-xl overflow-hidden"
              style={{ minWidth: 0 }}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] p-4 shrink-0">
                <Link to="/" className="flex items-center gap-2 min-w-0">
                  <img src="/image.png" alt="ColdCraft" className="h-7 w-7 rounded-lg object-cover shrink-0" />
                  <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 truncate">ColdCraft</span>
                </Link>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-white/60 hover:text-white hover:bg-white/10" onClick={() => setSidebarOpen(false)}>
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-3 shrink-0">
                <Button onClick={handleNewEmail} className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90" size="sm">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  New Email
                </Button>
              </div>

              <ScrollArea className="flex-1 px-3 min-h-0">
                <div className="space-y-1 pb-3">
                  {emails.map((email) => (
                    <EmailCard
                      key={email.id}
                      email={email}
                      selected={selectedEmail?.id === email.id}
                      onClick={() => setSelectedEmail(email)}
                    />
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t border-white/[0.08] p-3 shrink-0">
                <Button variant="ghost" size="sm" className="w-full justify-start text-white/40 hover:text-white hover:bg-white/10" onClick={() => { logout(); navigate("/"); }}>
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Logout
                </Button>
              </div>

              {/* Resize handle */}
              <div
                onMouseDown={startResize}
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize group flex items-center justify-center hover:bg-indigo-500/10 z-10"
              >
                <GripVertical className="h-4 w-4 text-white/0 group-hover:text-white/40 transition-colors" />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Top bar — always shows branding + toggle */}
          <div className="flex items-center gap-3 border-b border-white/[0.08] bg-black/30 backdrop-blur-md px-4 py-2 shrink-0">
            {!sidebarOpen && (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10" onClick={() => setSidebarOpen(true)}>
                  <PanelLeft className="h-4 w-4" />
                </Button>
                <Link to="/" className="flex items-center gap-2">
                  <img src="/image.png" alt="ColdCraft" className="h-6 w-6 rounded-md object-cover" />
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">ColdCraft</span>
                </Link>
                <div className="h-4 w-px bg-white/10" />
              </>
            )}
            <span className="text-xs text-white/30 tracking-wide uppercase">Dashboard</span>
          </div>

          <ScrollArea className="flex-1">
            <div className="mx-auto max-w-3xl space-y-6 p-6">
              <div>
                <h1 className="text-2xl font-bold tracking-[-0.04em] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Generate Cold Email
                </h1>
                <p className="text-sm text-white/40" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Fill in the details and let AI craft the perfect outreach email.
                </p>
              </div>
              <GenerateForm onGenerate={handleGenerate} loading={generating} />
              <OutputPanel email={selectedEmail} loading={generating} />
            </div>
          </ScrollArea>
        </main>
      </div>
    </TubesBackground>
  );
};

export default Dashboard;
