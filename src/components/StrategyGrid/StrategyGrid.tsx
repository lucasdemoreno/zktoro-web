"use client";
import { Grid } from "@radix-ui/themes";
import { StrategyCard } from "../StrategyCard/StrategyCard";
import { BrowseStrategy } from "@/types/browse";
import { createBreakpoint } from "react-use";
import { useEffect, useMemo, useState } from "react";

function getColumnCount(breakpoint: string): string {
  console.log(breakpoint);
  switch (breakpoint) {
    case "s":
      return "1";
    case "m":
      return "2";
    case "l":
      return "3";
    case "xl":
      return "4";
    default:
      return "4";
  }
}

export const StrategyGrid = ({
  strategies,
}: {
  strategies: BrowseStrategy[];
}) => {
  const useBreakpoint = useMemo(
    () => createBreakpoint({ xl: 1280, l: 768, m: 640, s: 350 }),
    []
  );
  const [columns, setColumns] = useState<string | null>(null);
  const breakpoint = useBreakpoint();

  useEffect(() => {
    setColumns(getColumnCount(breakpoint));
  }, [breakpoint]);

  if (!columns) return null;

  return (
    <Grid columns={columns} width="auto" gap="4">
      {strategies.map((strategy) => (
        <StrategyCard key={strategy.name} strategy={strategy} />
      ))}
    </Grid>
  );
};
