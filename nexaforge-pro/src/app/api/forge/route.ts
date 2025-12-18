import { NextResponse } from "next/server";
import { z } from "zod";
import { runForgePipeline, validateIndustry, validateTheme } from "@/server/forge-engine";
import type { ForgeRequest } from "@/types/forge";

const forgeSchema = z.object({
  projectName: z.string().min(2),
  brandVoice: z.string().min(6),
  targetAudience: z.string().min(6),
  primaryGoal: z.string().min(4),
  industry: z.string().refine((val) => validateIndustry(val), "Invalid industry"),
  theme: z.string().refine((val) => validateTheme(val), "Invalid theme"),
  tone: z.enum(["Bold", "Elegant", "Playful", "Technical", "Human"]),
  features: z.array(z.string()).max(10),
  integrations: z.object({
    stripe: z.boolean(),
    booking: z.boolean(),
    contactForm: z.boolean(),
    blog: z.boolean(),
  }),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = forgeSchema.parse(json) as ForgeRequest;
    const response = await runForgePipeline(parsed);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Forge API Error", error);
    return NextResponse.json(
      { error: "Unable to generate blueprint" },
      { status: 500 }
    );
  }
}
