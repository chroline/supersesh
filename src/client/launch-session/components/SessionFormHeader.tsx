import React from "react";

import { Box, Heading, Link, Text, useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";

export const SessionFormHeader: React.FC<{
  title: string;
  redirect: {
    hint: string;
    title: string;
    href: string;
  };
}> = ({ title, redirect }) => {
  const { colorMode } = useColorMode();

  return (
    <Box pt={6} textAlign={"center"}>
      <Heading as={"h1"} size={"3xl"}>
        {title}
      </Heading>
      <Text pt={3} lineHeight={"shorter"}>
        {redirect.hint}{" "}
        <NextLink href={redirect.href} passHref>
          <Link color={{ dark: "blue.400", light: "blue.500" }[colorMode]} fontWeight={"medium"}>
            {redirect.title}
          </Link>
        </NextLink>
      </Text>
    </Box>
  );
};
