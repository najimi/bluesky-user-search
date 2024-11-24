import "./styles.css";

import { Box, Text } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Box as="header">
      <Text as="h1" textStyle="3xl" fontWeight="bold" className="title">
        <Text as="span" fontWeight="semibold" textTransform="uppercase">
          Bluesky
        </Text>
        User search
      </Text>
    </Box>
  );
};
