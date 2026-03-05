"use client";

import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { LuLogOut } from "react-icons/lu";

import { useAuth } from "../contexts/auth-context";
import { Avatar } from "./ui/avatar";
import { ColorModeButton } from "./ui/color-mode";
import { Tooltip } from "./ui/tooltip";
import { toaster } from "./ui/toaster";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch {
      toaster.error({ title: "Erro ao fazer logout" });
    }
  };

  return (
    <Box
      as="nav"
      px="6"
      py="3"
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg"
    >
      <Flex align="center" justify="space-between" maxW="7xl" mx="auto">
        <Text fontWeight="bold" fontSize="lg" color="fg">
          Task Manager
        </Text>

        <Flex align="center" gap="2">
          <ColorModeButton />

          <Flex align="center" ml="4" mr="2">
            <Avatar name={user?.name} size="xs">
              {initial}
            </Avatar>
            <Text ml="2" color="fg">
              {user?.name}
            </Text>
          </Flex>

          <Tooltip content="Sair" showArrow>
            <IconButton
              aria-label="Logout"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LuLogOut />
            </IconButton>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
}
