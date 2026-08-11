"use client";

import * as React from "react";
import { programLevels, programs } from "@/lib/data/programs";
import { ProgramCard } from "@/features/programas/program-card";
import { Button } from "@/components/ui/button";

const ALL = "todos";

export function ProgramFilterList() {
  const [level, setLevel] = React.useState<string>(ALL);
  const filtered = level === ALL ? programs : programs.filter((p) => p.level === level);

  return (
    <div>
      <div className="mb-7 flex flex-wrap gap-2.5">
        <Button
          variant={level === ALL ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setLevel(ALL)}
        >
          Todos
        </Button>
        {programLevels.map((lv) => (
          <Button
            key={lv}
            variant={level === lv ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setLevel(lv)}
          >
            {lv}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}
      </div>
    </div>
  );
}
