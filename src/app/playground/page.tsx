import { Canvas } from "@/components/Canvas/Canvas";
import { Topbar } from "@/components/Topbar/Topbar";
import { Flex, Section } from "@radix-ui/themes";

export default function Playground() {
  return (
    <main>
      <Topbar />
      <Section p="2">
        <Flex direction="column" align="center">
          <Canvas />
        </Flex>
      </Section>
    </main>
  );
}
