"use client";
import styles from "./Topbar.module.css";
import NextLink from "next/link";
import { Flex, Text, Link, Section } from "@radix-ui/themes";
import Image from "next/image";
import { ProfileButton } from "../ProfileButton/ProfileButton";
import { usePathname } from "next/navigation";

export const Topbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getLinkStyles = (path: string) => {
    if (isActive(path)) {
      return styles.active;
    }
    return "";
  };

  return (
    <Section className={styles.topbar} p="4">
      <Flex justify="between">
        <Flex gap="6" align="center">
          <Link asChild underline={isActive("/") ? "always" : "hover"}>
            <NextLink href="/" className={getLinkStyles("/")}>
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
          <Link asChild underline={isActive("/workspace") ? "always" : "hover"}>
            <NextLink href="/workspace" className={getLinkStyles("/workspace")}>
              <Text weight="bold" as="span" className={styles.text}>
                Workspace
              </Text>
            </NextLink>
          </Link>
          <Link asChild underline={isActive("/browse") ? "always" : "hover"}>
            <NextLink href="/browse" className={getLinkStyles("/browse")}>
              <Text weight="bold" as="span" className={styles.text}>
                Discover
              </Text>
            </NextLink>
          </Link>
        </Flex>
        <Flex align="center">
          <ProfileButton />
        </Flex>
      </Flex>
    </Section>
  );
};
