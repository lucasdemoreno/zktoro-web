import { StrategyContent } from "@/components/StrategyContent/StrategyContent";
import { Topbar } from "@/components/Topbar/Topbar";
import { getStrategyById } from "@/db/db";
import { StrategyProvider } from "@/providers/StrategyProvider/StrategyProvider";
import { Flex, Section } from "@radix-ui/themes";

/**
 * Still very much a work in progress.
 */
export default async function Strategy({
  params,
}: {
  params: { strategyId: string };
}) {
  const { strategyId } = params;
  const strategy = await getStrategyById(strategyId);
  return (
    <main>
      <Topbar />
      <Section p="2">
        <Flex direction="column" align="center">
          <StrategyProvider>
            <StrategyContent strategy={strategy} />
          </StrategyProvider>
        </Flex>
      </Section>
    </main>
  );
}
