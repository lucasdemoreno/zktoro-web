import { StrategyCard } from "@/components/StrategyCard/StrategyCard";
import { Topbar } from "@/components/Topbar/Topbar";
import { Flex, Grid, Heading, Section } from "@radix-ui/themes";

export default function Browse() {
  return (
    <main>
      <Topbar />
      <Section p="2">
        <Flex direction="column" align="center">
          <Heading size="8">Browse</Heading>
          <Section p="6">
            <Grid columns="4" width="auto" gap="4">
              <StrategyCard />
              <StrategyCard />
              <StrategyCard />
              <StrategyCard />
              <StrategyCard />
              <StrategyCard />
              <StrategyCard />
              <StrategyCard />
            </Grid>
          </Section>
        </Flex>
      </Section>
    </main>
  );
}
