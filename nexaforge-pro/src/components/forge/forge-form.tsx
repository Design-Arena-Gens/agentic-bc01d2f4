'use client';

import * as React from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRY_OPTIONS, THEME_OPTIONS, DEFAULT_FEATURES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { ForgeRequest, ForgeResponse } from "@/types/forge";

type ForgeFormProps = {
  onBlueprintReady: (response: ForgeResponse) => void;
};

type FormInputs = ForgeRequest;

const tones: FormInputs["tone"][] = ["Bold", "Elegant", "Playful", "Technical", "Human"];

const defaultEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: defaultEase } },
};

export function ForgeForm({ onBlueprintReady }: ForgeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      projectName: "NexaForge Pro",
      brandVoice: "Futuristic, authoritative, and conversion-focused.",
      targetAudience: "Product teams and founders launching AI-powered digital experiences.",
      primaryGoal: "Launch a production-grade, AI-driven marketing site that converts.",
      industry: INDUSTRY_OPTIONS[0],
      theme: THEME_OPTIONS[0],
      tone: "Bold",
      features: DEFAULT_FEATURES,
      integrations: {
        stripe: true,
        booking: true,
        contactForm: true,
        blog: true,
      },
    },
  });

  const features = watch("features");
  const tone = watch("tone");

  const toggleFeature = (feature: string) => {
    const next = features.includes(feature)
      ? features.filter((item) => item !== feature)
      : [...features, feature];
    setValue("features", next);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Unable to generate blueprint");
      }

      const payload = (await response.json()) as ForgeResponse;
      onBlueprintReady(payload);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <motion.form
      className="space-y-10"
      onSubmit={onSubmit}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Brand DNA</h3>
          <p className="text-sm text-muted-foreground">
            Anchor the architect agent with a clear product identity.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="Enter the experience name"
              {...register("projectName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryGoal">Primary Outcome</Label>
            <Input
              id="primaryGoal"
              placeholder="e.g. Drive product demos, Signups"
              {...register("primaryGoal")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brandVoice">Brand Voice</Label>
          <Textarea
            id="brandVoice"
            rows={3}
            {...register("brandVoice")}
            placeholder="Describe how the copywriter agent should speak."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Textarea
            id="targetAudience"
            rows={3}
            {...register("targetAudience")}
            placeholder="Who are we persuading? Include pains, expectations, or segmentation."
          />
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Strategic Filters</h3>
          <p className="text-sm text-muted-foreground">
            Calibrate the architect & visual agents with industry context.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry Signal</Label>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRY_OPTIONS.map((option) => {
                const active = watch("industry") === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setValue("industry", option)}
                    className={cn(
                      "rounded-xl border border-white/10 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide transition",
                      active
                        ? "bg-primary/70 text-primary-foreground shadow-lg shadow-blue-500/30"
                        : "bg-white/5 hover:bg-white/10 text-muted-foreground"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme Aesthetic</Label>
            <div className="grid grid-cols-2 gap-2">
              {THEME_OPTIONS.map((option) => {
                const active = watch("theme") === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setValue("theme", option)}
                    className={cn(
                      "rounded-xl border border-white/10 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide transition",
                      active
                        ? "bg-gradient-to-br from-primary via-blue-500 to-purple-500 text-primary-foreground shadow-lg shadow-blue-500/40"
                        : "bg-white/5 hover:bg-white/10 text-muted-foreground"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <Label>Tonal Energy</Label>
          <div className="flex flex-wrap gap-3">
            {tones.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setValue("tone", option)}
                className={cn(
                  "rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all",
                  tone === option
                    ? "bg-white/90 text-slate-900 shadow-[0_18px_35px_-15px_rgba(148,163,184,0.6)]"
                    : "bg-white/10 text-muted-foreground hover:bg-white/20"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Feature Stack</h3>
          <p className="text-sm text-muted-foreground">
            Equip the agents with differentiators. Toggle or write your own.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_FEATURES.map((feature) => {
            const active = features.includes(feature);
            return (
              <button
                type="button"
                key={feature}
                onClick={() => toggleFeature(feature)}
                className={cn(
                  "rounded-2xl border border-white/10 px-4 py-2 text-sm transition-all",
                  active
                    ? "neu border-blue-500/30 text-primary-foreground"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                )}
              >
                {feature}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customFeatures">Custom Instructions</Label>
          <Textarea
            id="customFeatures"
            rows={4}
            placeholder="Add additional directives or integrations."
            onBlur={(event) => {
              const value = event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);
              if (value.length) {
                setValue("features", Array.from(new Set([...features, ...value])));
              }
            }}
          />
          <p className="text-xs text-muted-foreground">
            Tip: Press enter after your instructions to fold them into the agent stack.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Automation Layer</h3>
          <p className="text-sm text-muted-foreground">
            Tell the integration agent which services to auto-configure.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              key: "stripe" as const,
              title: "Stripe Commerce",
              description: "Provision products, prices, and checkout URLs.",
            },
            {
              key: "booking" as const,
              title: "Booking Suite",
              description: "Spin up Cal.com slots and embed scheduling UI.",
            },
            {
              key: "contactForm" as const,
              title: "Supabase CRM",
              description: "Generate table schema and webhook automations.",
            },
            {
              key: "blog" as const,
              title: "AI Content Hub",
              description: "Seed long-form resources and SEO clusters.",
            },
          ].map((integration) => {
            const active = watch("integrations")[integration.key];
            return (
              <motion.label
                key={integration.key}
                className={cn(
                  "flex cursor-pointer flex-col space-y-2 rounded-2xl border border-white/10 p-4 transition-all hover:border-primary/60",
                  active ? "glass border-blue-500/40" : "bg-white/5"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-foreground">
                    {integration.title}
                  </span>
                  <Badge variant={active ? "default" : "outline"}>
                    {active ? "Enabled" : "Optional"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {integration.description}
                </p>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={(event) =>
                    setValue("integrations", {
                      ...watch("integrations"),
                      [integration.key]: event.target.checked,
                    })
                  }
                />
              </motion.label>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        <motion.div
          className="sticky bottom-8 z-20 flex flex-col gap-3 rounded-3xl border border-white/15 bg-slate-900/70 p-4 shadow-[0_40px_120px_-30px_rgba(37,99,235,0.45)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              Engage the NexaForge pipeline
            </p>
            <p className="text-xs text-muted-foreground">
              Architect → Copywriter → Visual → Integration agents.
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Forging…" : "Forge Blueprint"}
          </Button>
        </motion.div>
      </AnimatePresence>
    </motion.form>
  );
}
