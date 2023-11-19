import { Box, Button, Flex, Text, TextField } from "@radix-ui/themes";
import styles from "../Canvas/Canvas.module.css";
import { useCallback } from "react";
import {
  Configuration,
  useStrategy,
} from "@/providers/StrategyProvider/StrategyProvider";

export const ConfigurationSection = () => {
  const { backtestStatus, onBacktest, configuration, onConfigurationChange } =
    useStrategy();
  const handleBacktest = useCallback(() => {
    // TODO: Validate that this configuration is okay.
    onBacktest();
  }, [onBacktest]);

  const handleChange = useCallback(
    (field: keyof Configuration) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfiguration = { ...configuration, [field]: e.target.value };
        onConfigurationChange(newConfiguration);
        return;
      },
    [configuration, onConfigurationChange]
  );

  return (
    <Box p="4">
      <Flex
        className={styles.configurationSection}
        p="3"
        direction="column"
        gap="1"
      >
        <Box>
          <Text size="1">Lifespan</Text>
          <TextField.Input
            size="1"
            onChange={handleChange("lifespan")}
            placeholder="1"
          />
        </Box>
        <Box>
          <Text size="1">Max Liquidity</Text>
          <TextField.Input
            size="1"
            onChange={handleChange("maxLiquidity")}
            placeholder="10000"
          />
        </Box>
        <Box>
          <Text size="1">Author</Text>
          <TextField.Input
            size="1"
            onChange={handleChange("author")}
            placeholder=""
          />
        </Box>
        <Box>
          <Text size="1">Profitability</Text>
          <TextField.Input
            size="1"
            onChange={handleChange("profitability")}
            placeholder="5%"
          />
        </Box>
        <Box>
          <Text size="1">Sharpe Ratio</Text>
          <TextField.Input
            size="1"
            onChange={handleChange("sharpeRatio")}
            placeholder="1.2"
          />
        </Box>
        <Box>
          <Text size="1">Standard Deviation</Text>
          <TextField.Input
            size="1"
            onChange={handleChange("standardDeviation")}
            placeholder="0.2"
          />
        </Box>
        <Box>
          <Text size="1">Max Drawdown</Text>
          <TextField.Input
            size="1"
            onChange={handleChange("maxDrawdown")}
            placeholder="1000"
          />
        </Box>
        <Box>
          <Text size="1">Frequency</Text>
          <TextField.Input
            size="1"
            onChange={handleChange("frequency")}
            placeholder="3"
          />
        </Box>
      </Flex>
      <Flex p="3" direction="row-reverse">
        <Button onClick={handleBacktest}>
          {backtestStatus.loading ? "..." : "Backtest"}
        </Button>
      </Flex>
    </Box>
  );
};
