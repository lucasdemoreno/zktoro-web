"use client";
import { Box, Button, Flex } from "@radix-ui/themes";
import styles from "../Canvas/Canvas.module.css";
import { DraggableStatement } from "../Canvas/Blocks";
import {
  emptyIfElseStatement,
  emptySendStatement,
  emptySwapStatement,
} from "@/providers/ProgramProvider/Statements";

export const ModulesSection = () => {
  return (
    <Box p="4">
      <Flex className={styles.modulesSection} p="4" direction="column" gap="4">
        <DraggableStatement statement={emptySendStatement} />
        <DraggableStatement statement={emptySwapStatement} />
        <DraggableStatement statement={emptyIfElseStatement} />
      </Flex>
    </Box>
  );
};
