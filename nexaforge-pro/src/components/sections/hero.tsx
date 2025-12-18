'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const gradientVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { duration: 18, repeat: Infinity, ease: "linear" as const },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-10 shadow-[0_80px_120px_-50px_rgba(59,130,246,0.55)]">
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 80% 20%, rgba(147,51,234,0.4), transparent 40%), radial-gradient(circle at 50% 80%, rgba(59,130,246,0.3), transparent 45%)",
          backgroundSize: "140% 140%",
        }}
        variants={gradientVariants}
        animate="animate"
      />
      <div className="relative z-10 space-y-6">
        <Badge className="bg-white/15 text-xs uppercase tracking-[0.3em]">
          NexaForge Pro · Agentic Builder
        </Badge>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
          Launch production-ready web experiences with orchestrated AI agents.
        </h1>
        <p className="max-w-2xl text-lg text-slate-200">
          Architect, copywriter, visual, and integration agents collaborate to deliver a
          complete site blueprint powered by Supabase, OpenAI GPT-4o, DALL·E 3, and
          Stripe automations. Ship premium experiences in hours, not weeks.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg">Run the Forge Engine</Button>
          <Button variant="outline" size="lg">
            View AI Studio
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Dynamic Site Blueprints", value: "End-to-end in 3 minutes" },
            { label: "Stripe, Supabase, OpenAI", value: "Production integrations" },
            { label: "Design Systems", value: "Glass + Neo aesthetics on demand" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white/70"
            >
              <p className="text-xs uppercase tracking-wide">{stat.label}</p>
              <p className="text-lg font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
