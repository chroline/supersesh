import React from "react";

import { Box, Button, Heading, Icon, Stack, Text, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { AddCircleRounded, PeopleRounded } from "@material-ui/icons";
import Head from "next/head";
import NextLink from "next/link";

import { CenterPageWrapper } from "~/client/core/components/CenterPageWrapper";
import { Logo } from "~/client/core/components/Logo";
import { PageTransition } from "~/client/core/components/PageTransition";

export default function HomePage() {
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const { colorMode } = useColorMode();

  return (
    <PageTransition variant={"fade"}>
      <Head>
        <title>SuperSesh!</title>
      </Head>
      <CenterPageWrapper>
        <Box maxW={"lg"} w={"full"}>
          <Heading as={"h1"} fontSize={{ base: "5xl", sm: "8xl" }}>
            <Logo />
          </Heading>
          <Text fontSize={{ base: "xl", sm: "2xl" }} fontWeight={"medium"} lineHeight={"shorter"}>
            <Text as={"span"} color={{ dark: "lightBlue.300", light: "lightBlue.700" }[colorMode]}>
              invite some friends,
            </Text>{" "}
            <Text as={"span"} color={{ dark: "red.300", light: "red.700" }[colorMode]}>
              send a chat,
            </Text>{" "}
            <Text as={"span"} color={{ dark: "green.300", light: "green.700" }[colorMode]}>
              listen to lofi beats.
            </Text>
          </Text>
          <br />
          <Text fontSize={{ base: "lg", sm: "xl" }}>
            manage your time and motivate yourself by working with others in a{" "}
            <Text as={"b"} fontWeight={"semibold"}>
              session
            </Text>{" "}
            <em>
              (
              <Text as={"b"} fontWeight={"semibold"}>
                sesh
              </Text>{" "}
              for short)
            </em>
            .
          </Text>
          <br />
          <Stack direction={{ base: "column", md: "row" }}>
            <NextLink href={"/session"} passHref>
              <Button
                as={"a"}
                w={"full"}
                size={buttonSize}
                colorScheme={"indigo"}
                leftIcon={<Icon as={AddCircleRounded} boxSize={5} />}
                shadow={"md"}
                _hover={{ shadow: "lg" }}
              >
                Start new sesh
              </Button>
            </NextLink>
            <NextLink href={"/join"} passHref>
              <Button
                as={"a"}
                w={"full"}
                size={buttonSize}
                colorScheme={"warmGray"}
                leftIcon={<Icon as={PeopleRounded} boxSize={5} />}
                shadow={"md"}
                _hover={{ shadow: "lg" }}
              >
                Join a sesh
              </Button>
            </NextLink>
          </Stack>
        </Box>
      </CenterPageWrapper>
    </PageTransition>
  );
}
