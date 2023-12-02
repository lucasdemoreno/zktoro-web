import { StrategyGrid } from "@/components/StrategyGrid/StrategyGrid";
import { Topbar } from "@/components/Topbar/Topbar";
import { getAllStrategies } from "@/db/db";
import { Flex, Heading, Section } from "@radix-ui/themes";

export default async function Browse() {
  const strategiesFromDB = await getAllStrategies();

  return (
    <main>
      <Topbar />
      <Section p="2" mt="4">
        <Flex direction="column" align="center">
          <Heading size="8">Discover</Heading>
          <Section p="6">
            <StrategyGrid strategies={strategiesFromDB} />
          </Section>
        </Flex>
      </Section>
    </main>
  );
}
