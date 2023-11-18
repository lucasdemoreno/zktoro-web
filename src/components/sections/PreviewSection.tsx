import { useStrategy } from "@/providers/StrategyProvider/StrategyProvider";
import { Box, Flex } from "@radix-ui/themes";
import styles from "../Canvas/Canvas.module.css";

export const PreviewSection = () => {
  return (
    <Flex className={styles.previewSection} p="4" direction="column" gap="4">
      <Box className="">
        <BackTestingChart></BackTestingChart>
      </Box>
    </Flex>
  );
};

const BackTestingChart = () => {
  const { backtestStatus } = useStrategy();
  let content = "Backtesting chart";
  if (backtestStatus.loading) {
    content = "Loading...";
  } else if (backtestStatus.error) {
    content = "Error";
  } else if (backtestStatus.data) {
    content = backtestStatus.data;
  }
  return (
    <Box className={styles.backTestingChart} p="4" grow="1">
      <Flex direction="column" align="center">
        {content}
      </Flex>
    </Box>
  );
};
