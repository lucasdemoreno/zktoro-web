import styles from "./Topbar.module.css";
import NextLink from "next/link";
import { Flex, Text, Link, Section } from "@radix-ui/themes";
import Image from "next/image";

export const Topbar = () => {
  return (
    <Section className={styles.topbar} p="2">
      <Flex justify="between">
        <Flex gap="6" align="center">
          <Link asChild>
            <NextLink href="/">
              <Flex align="center" gap="2">
                <Image
                  src={"/logo.png"}
                  alt="Picture of zkToro"
                  width={40}
                  height={40}
                  className={styles.logo}
                />
                <Text weight="bold" as="span" className={styles.text}>
                  zkToro
                </Text>
              </Flex>
            </NextLink>
          </Link>
          <Link asChild>
            <NextLink href="/workspace">
              <Text weight="bold" as="span" className={styles.text}>
                Workspace
              </Text>
            </NextLink>
          </Link>
          <Link asChild>
            <NextLink href="/browse">
              <Text weight="bold" as="span" className={styles.text}>
                Discover
              </Text>
            </NextLink>
          </Link>
        </Flex>
        <Flex align="center">
          <Link asChild>
            <NextLink href="/profile">
              <Text weight="bold" as="span" className={styles.text}>
                Profile
              </Text>
            </NextLink>
          </Link>
        </Flex>
      </Flex>
    </Section>
  );
};
