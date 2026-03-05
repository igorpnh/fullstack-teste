import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "../contexts/auth-context";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/tasks");
    }
  }, [user, router]);
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}
