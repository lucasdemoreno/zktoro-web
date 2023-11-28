import { StrategyCard } from "@/components/StrategyCard/StrategyCard";
import { Topbar } from "@/components/Topbar/Topbar";
import { getAllStrategies } from "@/db/db";
import { Flex, Grid, Heading, Section } from "@radix-ui/themes";

export default async function Browse() {
  const strategiesFromDB = await getAllStrategies();
  return (
    <main>
      <Topbar />
      <Section p="2">
        <Flex direction="column" align="center">
          <Heading size="8">Browse</Heading>
          <Section p="6">
            <Grid columns="4" width="auto" gap="4">
              {strategiesFromDB.map((strategy) => (
                <StrategyCard
                  key={strategy.name}
                  title={strategy.name}
                  description={strategy.description}
                  image={strategy.image}
                  id={strategy.id}
                />
              ))}
            </Grid>
          </Section>
        </Flex>
      </Section>
    </main>
  );
}
