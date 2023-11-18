import { Box, Button, Flex } from "@radix-ui/themes";
import styles from "../Canvas/Canvas.module.css";
import { useCallback } from "react";
import { useStrategy } from "@/providers/StrategyProvider/StrategyProvider";

export const ConfigurationSection = () => {
  const { backtestStatus, onBacktest } = useStrategy();
  const handleBacktest = useCallback(() => {
    onBacktest();
  }, [onBacktest]);
  return (
    <Box p="4">
      <Flex
        className={styles.configurationSection}
        p="6"
        direction="column"
        gap="4"
      >
        <Button>Configuration 1</Button>
        <Button>Configuration 2</Button>
        <Button>Configuration 3</Button>
        <Button>Configuration 4</Button>
        <Button>Configuration 5</Button>
      </Flex>
      <Flex p="6">
        <Button onClick={handleBacktest}>
          {backtestStatus.loading ? "..." : "Backtest"}
        </Button>
      </Flex>
    </Box>
  );
};
