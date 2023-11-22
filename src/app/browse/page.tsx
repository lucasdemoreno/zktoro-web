import { StrategyCard } from "@/components/StrategyCard/StrategyCard";
import { Topbar } from "@/components/Topbar/Topbar";
import { Flex, Grid, Heading, Section } from "@radix-ui/themes";

type BrowseStrategy = {
  name: string;
  description: string;
  image: string;
};

const strategy1: BrowseStrategy = {
  name: "Buy Dips and Hold",
  description:
    "When there is a bullish market trend generally, one trading approach is to purchase on dips and sell when the market recovers from a correction or consolidation. ",
  image: "/strategy-1.png",
};

const strategy2: BrowseStrategy = {
  name: "Day Trading Strategy",
  description:
    "Day trading is a strategy in which traders open and close positions during the same trading day. Day traders frequently enter and exit trading positions within the day and rarely hold positions overnight.",
  image: "/strategy-2.png",
};

const strategy3: BrowseStrategy = {
  name: "Swing Trading Strategy",
  description:
    "Swing trading is a strategy in which traders hold positions for longer than a single day, but generally for less than a month. Swing traders often use technical analysis to look for trading opportunities.",
  image: "/strategy-3.png",
};

const strategy4: BrowseStrategy = {
  name: "Scalping Strategy",
  description:
    "Scalping is a trading strategy in which traders profit off small price changes for a stock. Scalping relies on technical analysis, such as candlestick charts and MACD, for execution.",
  image: "/strategy-4.png",
};

const initialStrategies: BrowseStrategy[] = [
  strategy1,
  strategy2,
  strategy3,
  strategy4,
];

export default function Browse() {
  return (
    <main>
      <Topbar />
      <Section p="2">
        <Flex direction="column" align="center">
          <Heading size="8">Browse</Heading>
          <Section p="6">
            <Grid columns="4" width="auto" gap="4">
              {initialStrategies.map((strategy) => (
                <StrategyCard
                  key={strategy.name}
                  title={strategy.name}
                  description={strategy.description}
                  image={strategy.image}
                />
              ))}
            </Grid>
          </Section>
        </Flex>
      </Section>
    </main>
  );
}
