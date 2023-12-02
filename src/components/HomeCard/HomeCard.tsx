import { Text, Card, Inset, Strong } from "@radix-ui/themes";

import styles from "./HomeCard.module.css";
import { CodeIcon } from "@radix-ui/react-icons";

type HomeCardProps = {
  title: string;
  description: string;
};

export const HomeCard = ({ title, description }: HomeCardProps) => {
  return (
    <Card size="2" className={styles.card}>
      <Inset clip="padding-box" side="top" pb="current">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className={styles.image}>
          <CodeIcon width={40} height={40} />
        </div>
      </Inset>
      <Text size="3" className={styles.text}>
        <Strong>{title}</Strong>.<br />
      </Text>
      <Text as="p" size="3" className={styles.text}>
        {description}
      </Text>
    </Card>
  );
};
