import { Topbar } from "@/components/Topbar/Topbar";

import { Section, Heading, Flex } from "@radix-ui/themes";

export default function Home() {
  return (
    <main>
      <Topbar />
      <Section p="2">
        <Flex direction="column" align="center">
          <Heading size="8">Welcome to the zktoro</Heading>
        </Flex>
      </Section>
    </main>
  );
}
