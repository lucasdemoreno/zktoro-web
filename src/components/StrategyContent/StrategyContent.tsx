import { BrowseStrategy } from "@/types/browse";
import { Text, Flex, Button } from "@radix-ui/themes";

type StrategyContentProps = {
  strategy: BrowseStrategy | null;
};

export const StrategyContent = ({ strategy }: StrategyContentProps) => {
  if (!strategy) {
    return null;
  }

  return (
    <Flex>
      <Text as="p" size="3">
        {strategy.name}
      </Text>
      <Text as="p" size="3">
        {strategy.description}
      </Text>
      <Text as="p" size="3">
        {strategy.address}
      </Text>
      <Button>Invest in Strategy</Button>
    </Flex>
  );
};
