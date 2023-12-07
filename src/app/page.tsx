import { Topbar } from "@/components/Topbar/Topbar";

import {
  Section,
  Text,
  Heading,
  Flex,
  Box,
  Grid,
  Button,
} from "@radix-ui/themes";
import styles from "./home.module.css";
import { HomeCard } from "@/components/HomeCard/HomeCard";
import { Footer } from "@/components/Footer/Footer";
import NextLink from "next/link";

export default function Home() {
  return (
    <main>
      <Topbar />
      <Section p="6" className={styles.homeBanner}>
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
      <Section px="9" size="1">
        <Section p="2">
          <Flex p="8">
            <Flex direction="column">
              <Box style={{ maxWidth: "600px" }} pb="3">
                <Text size="8">
                  Connecting crypto trading with zero-knowledge proofs
                </Text>
              </Box>
              <Box style={{ maxWidth: "400px" }}>
                <Text>
                  We enable quantitative traders to safeguard their intellectual
                  property and identity. zkToro ensures a level of privacy and
                  security previously unattainable in the realm of DeFi.
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Section>
        <Section p="2">
          <Flex p="8" direction="column" align="end">
            <Flex direction="column">
              <Box style={{ maxWidth: "600px" }} pb="3">
                <Text size="8">Open-Sourceness of the DeFi Protocol</Text>
              </Box>
              <Box style={{ maxWidth: "400px" }}>
                <Text>
                  zkToro not only prioritizes privacy but also establishes trust
                  through transparency. Investors can fully trust the DeFi
                  protocol as zkToro embraces open-sourceness, providing
                  complete visibility into the underlying strategies and
                  operations.
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Section>
        <Section p="2">
          <Flex direction="column" align="center">
            <Flex py="8" style={{ maxWidth: "70vw", gap: "10vw" }}>
              <Flex direction="column" align="center">
                <Box>
                  <Text size="8"> {"> "} 20</Text>
                </Box>
                <Box>
                  <Text>Transactions</Text>
                </Box>
              </Flex>
              <Flex direction="column" align="center">
                <Box>
                  <Text size="8"> {"> "} $5</Text>
                </Box>
                <Box>
                  <Text>Transaction Volume</Text>
                </Box>
              </Flex>
              <Flex direction="column" align="center">
                <Box>
                  <Text size="8"> {"> "} 30</Text>
                </Box>
                <Box>
                  <Text>Strategies</Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Section>
        <Section p="2">
          <Flex direction="column" align="center">
            <Flex py="8" style={{ maxWidth: "70vw", gap: "10vw" }}>
              <Flex direction="column" align="center">
                <Box style={{ maxWidth: "600px" }} pb="3">
                  <Text size="8">Quantitative trading made easy</Text>
                </Box>
                <Box style={{ maxWidth: "400px" }}>
                  <Text>
                    zkToro provides a simple interface for quantitative traders
                    to deploy their strategies on-chain. We provide a set of
                    primitives that can be used to build complex trading
                    strategies.
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Section>
        <Section p="2">
          <Flex direction="column" align="center">
            <Flex py="8" style={{ maxWidth: "70vw", gap: "10vw" }}>
              <Flex direction="column" align="center">
                <Box style={{ maxWidth: "600px" }} pb="3">
                  <Text size="8">Take a sneak peak... </Text>
                </Box>
                <Box style={{ maxWidth: "700px" }}>
                  <Flex direction="row" align="center" gap="9" p="2">
                    <NextLink href="/browse">
                      <Button size="4">Discover Strategies</Button>
                    </NextLink>
                    <NextLink href="/workspace">
                      <Button size="4">Create a new Strategy</Button>
                    </NextLink>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Section>
      </Section>
      <Footer />
    </main>
  );
}
