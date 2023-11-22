import { Topbar } from "@/components/Topbar/Topbar";

import { Section, Heading, Flex } from "@radix-ui/themes";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main>
      <Topbar />
      <Section p="2" className={styles.homeBanner}>
        <Flex direction="column" align="center">
          <Heading size="9">Welcome to the zkToro</Heading>
        </Flex>
      </Section>
    </main>
  );
}
