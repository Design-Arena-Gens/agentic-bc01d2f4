import type { Industry, Theme } from "@/lib/constants";

export type ForgeRequest = {
  projectName: string;
  brandVoice: string;
  targetAudience: string;
  primaryGoal: string;
  industry: Industry;
  theme: Theme;
  tone: "Bold" | "Elegant" | "Playful" | "Technical" | "Human";
  features: string[];
  integrations: {
    stripe: boolean;
    booking: boolean;
    contactForm: boolean;
    blog: boolean;
  };
};

export type ArchitectBlueprint = {
  industry: Industry;
  theme: Theme;
  positioning: string;
  sitemap: { title: string; description: string; keyFeatures: string[] }[];
  uxDirectives: string[];
};

export type CopywriterDeliverable = {
  heroHeadline: string;
  subHeadline: string;
  bodyCopy: Record<string, string>;
  seoKeywords: string[];
  metaDescription: string;
  jsonLd: Record<string, unknown>;
};

export type VisualDirective = {
  paletteName: string;
  colorPalette: {
    accents: string[];
    neutrals: string[];
  };
  heroImagePrompt: string;
  heroImageUrl?: string;
  designEffects: string[];
};

export type IntegrationPlan = {
  stripeProducts: { name: string; price: number; interval: "one_time" | "month" }[];
  bookingConfiguration?: {
    provider: "calcom" | "cronofy" | "calendly";
    setupGuide: string;
  };
  contactForm: {
    fields: { name: string; label: string; type: "text" | "email" | "textarea" }[];
    supabaseTable: string;
  };
  automationNotes: string[];
};

export type ForgeResponse = {
  architect: ArchitectBlueprint;
  copywriter: CopywriterDeliverable;
  visual: VisualDirective;
  integration: IntegrationPlan;
  generatedAt: string;
  projectSlug: string;
};
