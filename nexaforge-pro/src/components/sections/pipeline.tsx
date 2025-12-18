'use client';

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    title: "Architect Agent",
    description:
      "Interprets brand signals, industry, and aesthetic theme to generate sitemap, UX directives, and layout heuristics.",
    metric: "24 industries × 20 themes",
  },
  {
    title: "Copywriter Agent",
    description:
      "Produces SEO-grade hero copy, section narratives, meta descriptions, and JSON-LD schema aligned with your tone.",
    metric: "GPT-4o tuned narrative engine",
  },
  {
    title: "Visual Agent",
    description:
      "Synthesizes color palettes, lighting styles, and DALL·E 3 hero imagery across glassmorphism or neumorphism presets.",
    metric: "MagicUI motion overlays",
  },
  {
    title: "Integration Agent",
    description:
      "Auto-configures Stripe billing, Supabase tables, contact workflows, and scheduling apps for hand-off free deployments.",
    metric: "Edge-functions ready",
  },
];

export function Pipeline() {
  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">
          Agentic pipeline
        </Badge>
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          Four specialized agents run the forge engine end-to-end.
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each agent is contextually aware of the others, creating a synchronized flow
          from strategy to automation. The result is a ready-to-ship blueprint aligned to
          your product vision.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: index * 0.05,
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/40 to-slate-900/10 p-6"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-cyan-500/10 blur-3xl" />
            </div>
            <div className="relative z-10 space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Step {index + 1}
              </p>
              <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {step.metric}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
