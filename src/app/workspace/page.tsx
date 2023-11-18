import { Canvas } from "@/components/Canvas/Canvas";
import { Topbar } from "@/components/Topbar/Topbar";
import { StrategyProvider } from "@/providers/StrategyProvider/StrategyProvider";
import { Flex, Section } from "@radix-ui/themes";

export default function Workspace() {
  return (
    <main>
      <Topbar />
      <Section p="2">
        <Flex direction="column" align="center">
          <StrategyProvider>
            <Canvas />
          </StrategyProvider>
        </Flex>
      </Section>
    </main>
  );
}
