import React from "react";

import { Box, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

import { Logo } from "~/client/core/components/Logo";

export const SessionFormLogo: React.FC = () => {
  return (
    <Box>
      <NextLink href={"/"} passHref>
        <Heading as={"a"} size={"xl"} opacity={0.8} _hover={{ opacity: 1 }}>
          <Logo />
        </Heading>
      </NextLink>
    </Box>
  );
};
