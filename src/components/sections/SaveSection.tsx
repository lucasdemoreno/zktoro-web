import { Button, Flex } from "@radix-ui/themes";
import styles from "../Canvas/Canvas.module.css";

export const SaveSection = () => {
  return (
    <Flex className={styles.saveSection} p="4" direction="column" gap="4">
      <Flex gap="3">
        <Button>Save</Button>
        <Button>Upload</Button>
      </Flex>
    </Flex>
  );
};
