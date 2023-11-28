import { Text, Card, Inset, Strong, Link } from "@radix-ui/themes";
import NextLink from "next/link";

type StrategyCardProps = {
  title: string;
  description: string;
  image: string;
  id: string;
};

export const StrategyCard = ({
  title,
  description,
  image,
  id,
}: StrategyCardProps) => {
  return (
    <Link asChild>
      <NextLink href={`/strategy/${id}`}>
        <Card size="2" style={{ maxWidth: 240 }}>
          <Inset clip="padding-box" side="top" pb="current">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
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
            <Strong>{title}</Strong>. {description}.
          </Text>
        </Card>
      </NextLink>
    </Link>
  );
};
