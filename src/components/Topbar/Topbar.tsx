import styles from "./Topbar.module.css";
import NextLink from "next/link";
import { Flex, Text, Link, Section } from "@radix-ui/themes";

export const Topbar = () => {
  return (
    <Section className={styles.topbar} p="2">
      <Flex justify="between">
        <Flex gap="4">
          <Text>Name/Logo</Text>
          <Link asChild>
            <NextLink href="/playground">Playground</NextLink>
          </Link>
        </Flex>
        <Flex>
          <Text>Account</Text>
        </Flex>
      </Flex>
    </Section>
  );
};
