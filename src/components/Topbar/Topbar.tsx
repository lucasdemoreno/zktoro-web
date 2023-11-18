import styles from "./Topbar.module.css";
import NextLink from "next/link";
import { Flex, Text, Link, Section } from "@radix-ui/themes";

export const Topbar = () => {
  return (
    <Section className={styles.topbar} p="2">
      <Flex justify="between">
        <Flex gap="4">
          <Link asChild>
            <NextLink href="/">zktoro</NextLink>
          </Link>
          <Link asChild>
            <NextLink href="/workspace">Workspace</NextLink>
          </Link>
          <Link asChild>
            <NextLink href="/browse">Browse</NextLink>
          </Link>
        </Flex>
        <Flex>
          <Link asChild>
            <NextLink href="/profile">Profile</NextLink>
          </Link>
        </Flex>
      </Flex>
    </Section>
  );
};
