import { BrowseStrategy } from "@/types/browse";
import { Text, Card, Inset, Strong, Link } from "@radix-ui/themes";
import NextLink from "next/link";
import styles from "./StrategyCard.module.css";
import { CodeIcon } from "@radix-ui/react-icons";

type StrategyCardProps = {
  strategy: BrowseStrategy;
};

export const StrategyCard = ({ strategy }: StrategyCardProps) => {
  const { name, description, id } = strategy;

  return (
    <Link asChild>
      <NextLink href={`/strategy/${id}`} className={styles.card}>
        <Card size="2">
          <Inset clip="padding-box" side="top" pb="current">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className={styles.image}>
              <CodeIcon width={40} height={40} />
            </div>
          </Inset>
          <Text as="p" size="3" className={styles.text}>
            <Strong>{name}</Strong>.<br />
            {description}
          </Text>
        </Card>
      </NextLink>
    </Link>
  );
};
