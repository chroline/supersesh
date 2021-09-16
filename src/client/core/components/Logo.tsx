import React from "react";

import { Text, useColorMode } from "@chakra-ui/react";

export const Logo = () => {
  const { colorMode } = useColorMode();
  return (
    <Text as={"span"} fontStyle={"italic"}>
      Super
      <Text as={"span"} color={{ dark: "indigo.200", light: "indigo.500" }[colorMode]}>
        Sesh!
      </Text>
    </Text>
  );
};
