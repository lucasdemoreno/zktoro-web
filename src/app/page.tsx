import { Topbar } from "@/components/Topbar/Topbar";

import { Section, Heading, Flex, Box, Grid } from "@radix-ui/themes";
import styles from "./home.module.css";
import { HomeCard } from "@/components/HomeCard/HomeCard";
import { Footer } from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main>
      <Topbar />
      <Section p="2" className={styles.homeBanner}>
        <Flex direction="column" align="center">
          <Box className={styles.title}>
            <Heading trim="normal" size="9">
              zkToro
            </Heading>
            <Heading trim="normal" size="5" className={styles.subtitle}>
              Empowering Decentralized Cryptocurrency Trading
              <br />
              with Zero-Knowledge Proofs
            </Heading>
          </Box>
        </Flex>
      </Section>
      <Section p="2">
        <Flex direction="column" align="center">
          <Flex>
            <Box>Volume |</Box>
            <Box>Transactions |</Box>
            <Box>Strategies</Box>
          </Flex>
        </Flex>
      </Section>
      <Section p="2">
        <Flex direction="column" align="center">
          <Box>
            <Grid columns="1" width="auto" gap="4">
              <HomeCard
                title="zkToro redefines decentralized cryptocurrency trading by introducing
            zero-knowledge proofs"
                description="We enable quantitative traders to safeguard their intellectual
            property and identity. zkToro ensures a level of privacy and
            security previously unattainable in the realm of DeFi."
              />
              <HomeCard
                title="Preserving Intellectual Property and Identity: Unleashing the Power
            of Quantitative Trading"
                description="By leveraging zero-knowledge proofs, zkToro empowers quant traders
            to protect their strategies."
              />
              <HomeCard
                title="Trust Through Transparency: Open-Sourceness of the DeFi Protocol"
                description="zkToro not only prioritizes privacy but also establishes trust
            through transparency. Investors can fully trust the DeFi protocol as
            zkToro embraces open-sourceness, providing complete visibility into
            the underlying strategies and operations."
              />
            </Grid>
          </Box>
        </Flex>
      </Section>
      <Footer />
    </main>
  );
}
