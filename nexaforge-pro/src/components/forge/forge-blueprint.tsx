'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ForgeResponse } from "@/types/forge";
import { Button } from "@/components/ui/button";

type ForgeBlueprintProps = {
  data?: ForgeResponse | null;
};

const defaultEase = [0.16, 1, 0.3, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.45, ease: defaultEase },
  }),
};

export function ForgeBlueprint({ data }: ForgeBlueprintProps) {
  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {!data ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center"
          >
            <p className="text-lg font-semibold text-muted-foreground">
              Blueprints will materialize here once the agents complete their forge.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={data.projectSlug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8"
          >
            <header className="space-y-3 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/50 to-slate-900/10 p-8 backdrop-blur-2xl">
              <Badge className="w-fit">Forge Complete</Badge>
              <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-start">
                <div>
                  <h2 className="text-3xl font-semibold text-foreground">
                    {data.copywriter.heroHeadline}
                  </h2>
                  <p className="mt-2 text-lg text-muted-foreground">
                    {data.copywriter.subHeadline}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <span>Industry: {data.architect.industry}</span>
                    <span>Theme: {data.architect.theme}</span>
                    <span>Palette: {data.visual.paletteName}</span>
                  </div>
                </div>
                {data.visual.heroImageUrl && (
                  <motion.div
                    className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.visual.heroImageUrl}
                      alt={data.visual.heroImagePrompt}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                    <p className="mt-3 text-xs text-muted-foreground">
                      Prompt: {data.visual.heroImagePrompt}
                    </p>
                  </motion.div>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {data.copywriter.seoKeywords.slice(0, 6).map((keyword) => (
                  <Badge key={keyword} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </header>

            <motion.section
              custom={0}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-foreground">
                      Architect Agent
                    </CardTitle>
                    <Badge variant="outline">Information Architecture</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{data.architect.positioning}</p>
                  <div className="grid gap-6 md:grid-cols-2">
                    {data.architect.sitemap.map((node) => (
                      <div
                        key={node.title}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <h3 className="text-lg font-medium text-foreground">
                          {node.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {node.description}
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                          {node.keyFeatures.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      UX Directives
                    </h4>
                    <ul className="mt-3 grid gap-3 md:grid-cols-2">
                      {data.architect.uxDirectives.map((directive) => (
                        <li
                          key={directive}
                          className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-muted-foreground"
                        >
                          {directive}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section
              custom={1}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-foreground">
                      Copywriter Agent
                    </CardTitle>
                    <Badge variant="outline">Content System</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="rounded-2xl bg-white/5 p-4 text-sm text-muted-foreground">
                    {data.copywriter.metaDescription}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(data.copywriter.bodyCopy).map(([section, copy]) => (
                      <div
                        key={section}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <h3 className="text-base font-semibold text-foreground">
                          {section}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      JSON-LD Schema
                    </h4>
                    <pre className="max-h-72 overflow-y-auto rounded-2xl bg-slate-950/80 p-4 text-xs text-blue-100">
                      {JSON.stringify(data.copywriter.jsonLd, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section
              custom={2}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-foreground">
                      Visual Agent
                    </CardTitle>
                    <Badge variant="outline">Design Directive</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-base font-semibold text-foreground">Palette</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {data.visual.paletteName}
                      </p>
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">Accents</p>
                          <div className="mt-2 flex gap-2">
                            {data.visual.colorPalette.accents.map((color) => (
                              <div
                                key={color}
                                className="h-10 w-10 rounded-xl border border-white/20"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Neutrals
                          </p>
                          <div className="mt-2 flex gap-2">
                            {data.visual.colorPalette.neutrals.map((color) => (
                              <div
                                key={color}
                                className="h-10 w-10 rounded-xl border border-white/20"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-base font-semibold text-foreground">
                        Design Effects
                      </h3>
                      <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                        {data.visual.designEffects.map((effect) => (
                          <li key={effect} className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-purple-400" />
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section
              custom={3}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-foreground">
                      Integration Agent
                    </CardTitle>
                    <Badge variant="outline">Automation Blueprint</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-base font-semibold text-foreground">
                      Stripe Products
                    </h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {data.integration.stripeProducts.map((product) => (
                        <div key={product.name} className="rounded-xl bg-black/40 p-3">
                          <p className="text-sm font-semibold text-foreground">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.interval === "month" ? "Monthly" : "One-time"} · $
                            {(product.price / 100).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {data.integration.bookingConfiguration && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-base font-semibold text-foreground">
                        Booking Suite
                      </h3>
                      <p className="text-xs uppercase text-muted-foreground">
                        {data.integration.bookingConfiguration.provider}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {data.integration.bookingConfiguration.setupGuide}
                      </p>
                    </div>
                  )}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-base font-semibold text-foreground">
                      Contact Matrix
                    </h3>
                    <p className="text-xs uppercase text-muted-foreground">
                      Supabase Table: {data.integration.contactForm.supabaseTable}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.integration.contactForm.fields.map((field) => (
                        <Badge key={field.name} variant="outline">
                          {field.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-base font-semibold text-foreground">
                      Automation Notes
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {data.integration.automationNotes.map((note) => (
                        <li key={note} className="flex items-start gap-2">
                          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <footer className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  project slug: {data.projectSlug}
                </p>
                <p className="text-xs text-muted-foreground">
                  generated {new Date(data.generatedAt).toLocaleString()}
                </p>
              </div>
              <Button variant="secondary" className="gap-2">
                Export Blueprint
              </Button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
