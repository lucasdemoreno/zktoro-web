import { Flex, Text } from "@radix-ui/themes";
import styles from "./Footer.module.css";
import {
  DiscordLogoIcon,
  LinkedInLogoIcon,
  GitHubLogoIcon,
  NotionLogoIcon,
} from "@radix-ui/react-icons";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Flex gap="5" p="6" mt="4" align="center">
        <DiscordLogoIcon /> <LinkedInLogoIcon /> <GitHubLogoIcon />
        <NotionLogoIcon />
        <Text>&copy; 2023 zkToro</Text>
      </Flex>
    </footer>
  );
};
