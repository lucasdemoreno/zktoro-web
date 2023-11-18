import { Canvas } from "@/components/Canvas/Canvas";
import { Topbar } from "@/components/Topbar/Topbar";
import { Flex, Heading, Section } from "@radix-ui/themes";

export default function Profile() {
  return (
    <main>
      <Topbar />
      <Section p="2">
        <Flex direction="column" align="center">
          <Heading size="8">Profile page</Heading>
        </Flex>
      </Section>
    </main>
  );
}
