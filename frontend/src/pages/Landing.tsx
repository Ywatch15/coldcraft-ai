import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Mail, Brain, Clock, Target, Shield, Sparkles } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Generation", description: "Leverage advanced AI to craft personalized cold emails that convert.", span: "col-span-2" },
  { icon: Target, title: "Hyper-Personalized", description: "Tailor every email to your recipient's role, company, and context." },
  { icon: Clock, title: "Save 80% Time", description: "Generate professional emails in seconds, not hours." },
  { icon: Mail, title: "Email History", description: "Track all your generated emails with full search and filtering." },
  { icon: Shield, title: "Tone Control", description: "From formal to casual — match any brand voice effortlessly." },
  { icon: Sparkles, title: "Smart Templates", description: "AI learns from best-performing patterns to improve output.", span: "col-span-2" },
];

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#030303]">
      <Navbar />

      {/* Hero — geometric shapes */}
      <HeroGeometric
        badge="AI-Powered Cold Email Generation"
        title1="Craft Emails That"
        title2="Actually Get Replies"
        description="Stop wasting hours on cold emails. ColdCraft uses AI to generate hyper-personalized outreach that converts prospects into conversations."
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {isAuthenticated ? (
            <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-rose-500 px-8 text-lg text-white hover:opacity-90" asChild>
              <Link to="/dashboard">Let's Generate a Cold Email</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-rose-500 px-8 text-lg text-white hover:opacity-90" asChild>
                <Link to="/auth?mode=register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 px-8 text-lg text-white/80 hover:bg-white/10 hover:text-white" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            </>
          )}
        </div>
      </HeroGeometric>

      {/* Features Bento Grid */}
      <section className="relative py-24 bg-[#030303]">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl text-white">
              Everything You Need to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Outreach at Scale
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-white/40">
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
                className={`min-h-[14rem] list-none ${feature.span || ""}`}
              >
                <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-white/[0.08] p-2 md:rounded-[1.5rem] md:p-3">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                  />
                  <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-white/[0.08] bg-[#060606] p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                      <div className="w-fit rounded-lg border-[0.75px] border-white/[0.08] bg-white/[0.05] p-2">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-white">
                          {feature.title}
                        </h3>
                        <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-white/40">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#030303] py-8 text-center text-sm text-white/30">
        <p>© {new Date().getFullYear()} ColdCraft. Built with AI-powered precision.</p>
      </footer>
    </div>
  );
};

export default Landing;
