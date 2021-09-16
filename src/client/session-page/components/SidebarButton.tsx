import React from "react";

import { As, HStack, Icon, Text, useColorMode } from "@chakra-ui/react";

import theme from "~/client/core/styles/theme";

export const SidebarButton: React.FC<{ icon: As<any>; color?: string; onClick?: () => void }> = ({
  icon,
  color = "warmGray",
  onClick,
  children,
}) => {
  const { colorMode } = useColorMode();

  return (
    <HStack
      as={"button"}
      onClick={onClick}
      w={"full"}
      py={1}
      px={3}
      spacing={3}
      _hover={onClick ? { bg: { dark: "warmGray.800", light: "warmGray.100" }[colorMode] } : { cursor: "default" }}
      _focus={onClick && { bg: { dark: "warmGray.800", light: "warmGray.100" }[colorMode] }}
      _active={onClick && { bg: { dark: "warmGray.700", light: "warmGray.200" }[colorMode] }}
      borderRadius={"md"}
    >
      <Icon
        as={icon}
        style={{ fontSize: theme.sizes[5] }}
        color={{ dark: color + ".300", light: color + ".700" }[colorMode]}
      />
      <Text color={{ dark: color + ".300", light: color + ".700" }[colorMode]} fontWeight={"medium"} fontSize={"md"}>
        {children}
      </Text>
    </HStack>
  );
};
