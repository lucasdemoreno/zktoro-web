import { Topbar } from "@/components/Topbar/Topbar";

import { Section, Heading } from "@radix-ui/themes";

export default function Home() {
  return (
    <main>
      <Topbar />
      <Section>
        <Heading size="9">Welcome to the playground</Heading>
      </Section>
    </main>
  );
}
