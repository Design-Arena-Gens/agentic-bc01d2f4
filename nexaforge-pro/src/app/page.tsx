'use client';

import * as React from "react";
import { ForgeForm } from "@/components/forge/forge-form";
import { ForgeBlueprint } from "@/components/forge/forge-blueprint";
import { Hero } from "@/components/sections/hero";
import { Pipeline } from "@/components/sections/pipeline";
import type { ForgeResponse } from "@/types/forge";

export default function Home() {
  const [blueprint, setBlueprint] = React.useState<ForgeResponse | null>(null);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12 md:py-16">
      <Hero />
      <Pipeline />
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="sticky top-6 h-fit space-y-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Configure the forge run
          </h2>
          <ForgeForm onBlueprintReady={setBlueprint} />
        </div>
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Agent output blueprint
          </h2>
          <ForgeBlueprint data={blueprint} />
        </div>
      </div>
    </div>
  );
}
