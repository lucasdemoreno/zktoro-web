import { BrowseStrategy } from "@/types/browse";
import { Text, Card, Inset, Strong, Link } from "@radix-ui/themes";
import NextLink from "next/link";

type StrategyCardProps = {
  strategy: BrowseStrategy;
};

export const StrategyCard = ({ strategy }: StrategyCardProps) => {
  const { name, description, image, id } = strategy;

  return (
    <Link asChild>
      <NextLink href={`/strategy/${id}`}>
        <Card size="2" style={{ maxWidth: 240 }}>
          <Inset clip="padding-box" side="top" pb="current">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={name}
              style={{
                display: "block",
                objectFit: "cover",
                width: "100%",
                height: 140,
                backgroundColor: "var(--gray-5)",
              }}
            />
          </Inset>
          <Text as="p" size="3">
            <Strong>{name}</Strong>. {description}.
          </Text>
        </Card>
      </NextLink>
    </Link>
  );
};
