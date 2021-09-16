import React from "react";

import { Heading } from "@chakra-ui/react";
import NextLink from "next/link";

import { Logo } from "~/client/core/components/Logo";

export const SessionFormLogo: React.FC = () => {
  return (
    <NextLink href={"/"} passHref>
      <Heading as={"a"} size={"xl"} p={3} m={-3} opacity={0.8} _hover={{ opacity: 1 }}>
        <Logo />
      </Heading>
    </NextLink>
  );
};
