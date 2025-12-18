import {
  DEFAULT_FEATURES,
  INDUSTRY_OPTIONS,
  THEME_OPTIONS,
  CTA_VARIANTS,
  PALETTE_LIBRARY,
} from "@/lib/constants";
import { chatCompletion } from "@/lib/openai";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { generateHeroImage } from "@/lib/visual";
import { slugify, titleCase } from "@/lib/utils";
import type {
  ArchitectBlueprint,
  CopywriterDeliverable,
  ForgeRequest,
  ForgeResponse,
  IntegrationPlan,
  VisualDirective,
} from "@/types/forge";
import { wait } from "@/lib/utils";

const systemPrompt = `You are the NexaForge architect agent. You must produce structured JSON following the provided schema. Keep responses concise but descriptive.`;

const copywriterSystemPrompt = `You are the NexaForge copywriter agent. Produce enticing marketing copy that balances creativity with clarity. Return JSON only.`;

const integrationSystemPrompt = `You are the NexaForge integration specialist. Output JSON strictly following the schema.`;

function getFallbackBlueprint(request: ForgeRequest): ArchitectBlueprint {
  const pages = [
    {
      title: "Home",
      description: `Immersive hero with animated layers introducing ${request.projectName}. Showcase key differentiators and a prominent ${request.primaryGoal}.`,
      keyFeatures: [
        "Hero narrative with layered motion graphics",
        "Value proposition grid mapped to audience pain-points",
        "Conversion CTA ribbon with persistent micro copy",
      ],
    },
    {
      title: "Solutions",
      description: "Modular blocks presenting product pillars with embedded animations.",
      keyFeatures: [
        "Problem > Outcome storytelling columns",
        "Interactive feature blueprints with depth transitions",
        "Customer archetype tabs highlighting tailored impact",
      ],
    },
    {
      title: "AI Studio",
      description:
        "Dynamic workspace showcasing how NexaForge automation assembles web experiences in real-time.",
      keyFeatures: [
        "Storyboard timeline of the agentic build process",
        "Live preview container with generated scenes",
        "Developer mode callout emphasising Supabase + Stripe stack",
      ],
    },
    {
      title: "Resources",
      description:
        "Thought-leadership hub featuring AI playbooks, templates, and benchmark reports.",
      keyFeatures: [
        "Filterable content matrix with AI tags",
        "SEO rich snippets for each resource",
        "Smart subscribe banner with contextual offers",
      ],
    },
    {
      title: "Launch",
      description:
        "Conversion page guiding users into a paid plan or bespoke build engagement.",
      keyFeatures: [
        "Pricing table integrated with Stripe checkout links",
        "Trust indicators and compliance badges",
        "Interactive FAQ leveraging accordions and pinned CTA",
      ],
    },
  ];

  return {
    industry: request.industry,
    theme: request.theme,
    positioning: `${request.projectName} delivers a ${request.tone.toLowerCase()} ${request.industry.toLowerCase()} experience with agentic site creation powered by AI.`,
    sitemap: pages,
    uxDirectives: [
      "Utilize layered glassmorphic shells and particle gradients for hero scenes.",
      "Apply magnetic cursor interactions to emphasize CTA states.",
      "Blend motion easing inspired by Framer Motion for soft yet premium transitions.",
      "Contrast copy blocks with diagonal dividers and organic blobs to add depth.",
    ],
  };
}

function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function runArchitectAgent(request: ForgeRequest) {
  const payload = {
    project: request.projectName,
    industry: request.industry,
    theme: request.theme,
    primaryGoal: request.primaryGoal,
    tone: request.tone,
    targetAudience: request.targetAudience,
    keyFeatures: request.features.length ? request.features : DEFAULT_FEATURES,
  };

  const completion = await chatCompletion(
    [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Schema:
{
  "industry": string,
  "theme": string,
  "positioning": string,
  "sitemap": Array<{ "title": string, "description": string, "keyFeatures": string[] }>,
  "uxDirectives": string[]
}

Instructions:
- Select the closest industry and theme.
- Provide UX directives that leverage Tailwind, Framer Motion, and high-end interactions.
- Emphasize how agents collaborate.
- Keep to 4-6 sitemap nodes.

Payload: ${JSON.stringify(payload, null, 2)}
`,
      },
    ],
    { temperature: 0.3 }
  );

  const blueprint =
    parseJson<ArchitectBlueprint>(completion ?? "") ?? getFallbackBlueprint(request);

  return blueprint;
}

function getFallbackCopy(request: ForgeRequest, blueprint: ArchitectBlueprint): CopywriterDeliverable {
  const heroHeadline = `Launch ${titleCase(request.projectName)} in hours, not months.`;
  const subHeadline =
    `NexaForge Pro orchestrates architect, copywriter, visual, and integration agents to deliver production-grade sites that convert. ${CTA_VARIANTS[
      Math.floor(Math.random() * CTA_VARIANTS.length)
    ]}.`;
  const bodyCopy: Record<string, string> = {};
  blueprint.sitemap.forEach((page) => {
    bodyCopy[page.title] = `${page.description} Featuring ${page.keyFeatures
      .slice(0, 2)
      .join(" and ")} for ${request.targetAudience}.`;
  });

  return {
    heroHeadline,
    subHeadline,
    bodyCopy,
    seoKeywords: [
      `${request.industry.toLowerCase()} website builder`,
      "AI website generator",
      "agentic web design",
      "supabase stripe integration",
    ],
    metaDescription:
      "NexaForge Pro is the AI-native builder where orchestrated agents craft performant websites with Supabase, Stripe, and OpenAI.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: request.projectName,
      applicationCategory: "WebApplication",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "99.00",
      },
    },
  };
}

async function runCopywriterAgent(
  request: ForgeRequest,
  blueprint: ArchitectBlueprint
): Promise<CopywriterDeliverable> {
  const completion = await chatCompletion(
    [
      { role: "system", content: copywriterSystemPrompt },
      {
        role: "user",
        content: `Schema:
{
  "heroHeadline": string,
  "subHeadline": string,
  "bodyCopy": Record<string, string>,
  "seoKeywords": string[],
  "metaDescription": string,
  "jsonLd": object
}

Blueprint: ${JSON.stringify(blueprint, null, 2)}

Integrations requested: ${JSON.stringify(request.integrations)}
Audience: ${request.targetAudience}
Brand voice: ${request.brandVoice}
`,
      },
    ],
    { temperature: 0.5 }
  );

  const copy =
    parseJson<CopywriterDeliverable>(completion ?? "") ??
    getFallbackCopy(request, blueprint);

  return copy;
}

function getFallbackVisual(request: ForgeRequest): VisualDirective {
  const palette = PALETTE_LIBRARY[0];
  return {
    paletteName: palette.name,
    colorPalette: palette,
    heroImagePrompt: `Cinematic ${request.industry.toLowerCase()} experience for ${request.projectName} in ${request.theme} style with atmospheric lighting and layered glass surfaces.`,
    designEffects: [
      "Glassmorphism surfaces with blurred gradient overlays",
      "Floating particle system responding to cursor movement",
      "Layered depth using parallax background beams",
    ],
  };
}

async function runVisualAgent(request: ForgeRequest): Promise<VisualDirective> {
  const fallback = getFallbackVisual(request);
  const completion = await chatCompletion(
    [
      {
        role: "system",
        content:
          "You are the visual agent. Respond with JSON describing palette, hero prompt, and design effects.",
      },
      {
        role: "user",
        content: `Schema:
{
  "paletteName": string,
  "colorPalette": { "accents": string[], "neutrals": string[] },
  "heroImagePrompt": string,
  "designEffects": string[]
}

Preferred palette library: ${JSON.stringify(PALETTE_LIBRARY)}
Theme: ${request.theme}
Brand tone: ${request.tone}
`,
      },
    ],
    { temperature: 0.6 }
  );

  const directive =
    parseJson<VisualDirective>(completion ?? "") ??
    fallback;

  const generatedImage = await generateHeroImage(directive.heroImagePrompt);

  if (generatedImage) {
    directive.heroImageUrl = generatedImage.url;
  }

  return directive;
}

function getFallbackIntegration(request: ForgeRequest): IntegrationPlan {
  return {
    stripeProducts: [
      { name: `${request.projectName} Launch Kit`, price: 9900, interval: "one_time" },
      { name: `${request.projectName} Pro Subscription`, price: 29900, interval: "month" },
    ],
    bookingConfiguration: request.integrations.booking
      ? {
          provider: "calcom",
          setupGuide:
            "Create a Cal.com event for 30 minute discovery calls. Embed using the official React component and sync availability from Supabase.",
        }
      : undefined,
    contactForm: {
      fields: [
        { name: "fullName", label: "Full Name", type: "text" },
        { name: "email", label: "Work Email", type: "email" },
        { name: "message", label: "Project Blueprint Request", type: "textarea" },
      ],
      supabaseTable: "forge_contacts",
    },
    automationNotes: [
      "Sync generated copy and media assets into Supabase storage bucket `forge-assets`.",
      "Trigger Stripe customer portal email when contact form submits for qualified leads.",
      "Log agent decisions into Supabase `agent_events` table for observability.",
    ],
  };
}

async function runIntegrationAgent(
  request: ForgeRequest,
  blueprint: ArchitectBlueprint
): Promise<IntegrationPlan> {
  const completion = await chatCompletion(
    [
      { role: "system", content: integrationSystemPrompt },
      {
        role: "user",
        content: `Schema:
{
  "stripeProducts": Array<{ "name": string, "price": number, "interval": "one_time" | "month" }>,
  "bookingConfiguration"?: { "provider": "calcom" | "cronofy" | "calendly", "setupGuide": string },
  "contactForm": {
    "fields": Array<{ "name": string, "label": string, "type": "text" | "email" | "textarea" }>,
    "supabaseTable": string
  },
  "automationNotes": string[]
}

Project data: ${JSON.stringify({ request, blueprint }, null, 2)}
`,
      },
    ],
    { temperature: 0.35 }
  );

  const plan =
    parseJson<IntegrationPlan>(completion ?? "") ??
    getFallbackIntegration(request);

  return plan;
}

async function persistBlueprint(response: ForgeResponse) {
  const client = getSupabaseAdmin();
  if (!client) return;

  try {
    await client.from("forge_projects").upsert({
      slug: response.projectSlug,
      payload: response,
    });
  } catch (error) {
    console.error("Unable to persist blueprint", error);
  }
}

async function ensureStripeProducts(plan: IntegrationPlan) {
  const stripe = getStripe();
  if (!stripe) return;

  try {
    await Promise.all(
      plan.stripeProducts.map(async (product) => {
        await stripe.products.create({
          name: product.name,
          default_price_data: {
            currency: "usd",
            unit_amount: product.price,
            recurring:
              product.interval === "month"
                ? {
                    interval: "month",
                  }
                : undefined,
          },
        });
      })
    );
  } catch (error) {
    console.error("Stripe provisioning skipped", error);
  }
}

export async function runForgePipeline(request: ForgeRequest): Promise<ForgeResponse> {
  const blueprint = await runArchitectAgent(request);
  await wait(250);
  const copy = await runCopywriterAgent(request, blueprint);
  await wait(250);
  const visual = await runVisualAgent(request);
  await wait(250);
  const integration = await runIntegrationAgent(request, blueprint);

  const projectSlug = slugify(`${request.projectName}-${Date.now()}`);

  const response: ForgeResponse = {
    architect: blueprint,
    copywriter: copy,
    visual,
    integration,
    generatedAt: new Date().toISOString(),
    projectSlug,
  };

  await Promise.allSettled([
    persistBlueprint(response),
    ensureStripeProducts(integration),
  ]);

  return response;
}

export function validateIndustry(industry: string) {
  return (INDUSTRY_OPTIONS as readonly string[]).includes(industry);
}

export function validateTheme(theme: string) {
  return (THEME_OPTIONS as readonly string[]).includes(theme);
}
