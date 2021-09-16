import { Box, chakra } from "@chakra-ui/react";

export const CenterPageWrapper = chakra(Box, {
  baseStyle: {
    w: "full",
    minH: "full",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 6,
  },
});
