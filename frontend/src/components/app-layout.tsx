import { Box } from "@chakra-ui/react";

import { Navbar } from "./navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box minH="100vh">
      <Navbar />
      <Box as="main">{children}</Box>
    </Box>
  );
}
