import { createStandaloneToast, extendTheme } from "@chakra-ui/react";

import theme from "./theme";

const toast = createStandaloneToast({ theme: extendTheme(theme), defaultOptions: { position: "bottom-right" } });

export default toast;
