import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Zap, Mail, Brain, Clock, Target, Shield, Sparkles } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Generation", description: "Leverage advanced AI to craft personalized cold emails that convert.", span: "col-span-2" },
  { icon: Target, title: "Hyper-Personalized", description: "Tailor every email to your recipient's role, company, and context." },
  { icon: Clock, title: "Save 80% Time", description: "Generate professional emails in seconds, not hours." },
  { icon: Mail, title: "Email History", description: "Track all your generated emails with full search and filtering." },
  { icon: Shield, title: "Tone Control", description: "From formal to casual — match any brand voice effortlessly." },
  { icon: Sparkles, title: "Smart Templates", description: "AI learns from best-performing patterns to improve output.", span: "col-span-2" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] animate-spiral" />
          <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px] animate-spiral" style={{ animationDelay: "-5s" }} />
          <div className="absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px] animate-spiral" style={{ animationDelay: "-10s", animationDirection: "reverse" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
              <Zap className="h-3 w-3 text-accent" />
              AI-Powered Cold Email Generation
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Craft Emails That
              <br />
              <span className="text-gradient">Actually Get Replies</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Stop wasting hours on cold emails. ColdCraft uses AI to generate hyper-personalized
              outreach that converts prospects into conversations.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-gradient-accent px-8 text-lg hover:opacity-90" asChild>
                <Link to="/auth?mode=register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-lg" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Everything You Need to <span className="text-gradient">Outreach at Scale</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Powerful features designed to make your cold email workflow effortless.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 ${feature.span || ""}`}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent">
                  <feature.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-all duration-500 group-hover:bg-primary/10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>© 2024 ColdCraft. Built with AI-powered precision.</p>
      </footer>
    </div>
  );
};

export default Landing;
