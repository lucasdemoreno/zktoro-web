export type BrowseStrategy = {
  id: string;
  address: string;
  isMocked?: boolean;
  name: string;
  description: string;
  image: string;
};

export const strategy1: BrowseStrategy = {
  id: "1",
  address: "0x1234",
  isMocked: true,
  name: "Buy Dips and Hold",
  description:
    "When there is a bullish market trend generally, one trading approach is to purchase on dips and sell when the market recovers from a correction or consolidation. ",
  image: "/strategy-1.png",
};

export const strategy2: BrowseStrategy = {
  id: "2",
  address: "0x1234",
  isMocked: true,
  name: "Day Trading Strategy",
  description:
    "Day trading is a strategy in which traders open and close positions during the same trading day. Day traders frequently enter and exit trading positions within the day and rarely hold positions overnight.",
  image: "/strategy-2.png",
};

export const strategy3: BrowseStrategy = {
  id: "3",
  address: "0x1234",
  isMocked: true,
  name: "Swing Trading Strategy",
  description:
    "Swing trading is a strategy in which traders hold positions for longer than a single day, but generally for less than a month. Swing traders often use technical analysis to look for trading opportunities.",
  image: "/strategy-3.png",
};

export const strategy4: BrowseStrategy = {
  id: "4",
  address: "0x1234",
  isMocked: true,
  name: "Scalping Strategy",
  description:
    "Scalping is a trading strategy in which traders profit off small price changes for a stock. Scalping relies on technical analysis, such as candlestick charts and MACD, for execution.",
  image: "/strategy-4.png",
};
