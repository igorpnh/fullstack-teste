import {
  Button,
  Card,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "../contexts/auth-context";
import { toaster } from "../components/ui/toaster";
import { ApiError } from "../lib/api";
import { Field } from "../components/ui/field";
import { PasswordInput } from "../components/ui/password-input";

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const toggleMode = () => {
    resetForm();
    setIsRegister((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await register({ name, email, password });
        toaster.success({ title: "Conta criada com sucesso!" });
      } else {
        await login({ email, password });
        toaster.success({ title: "Login realizado com sucesso!" });
      }
      router.push("/tasks");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Ocorreu um erro inesperado";
      toaster.error({ title: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.subtle">
      <Card.Root width="sm" p="6" shadow="md">
        <Card.Header pb="4" textAlign="center">
          <Heading size="xl">{isRegister ? "Criar Conta" : "Login"}</Heading>
          <Text color="fg.muted" mt="1" fontSize="sm">
            {isRegister
              ? "Preencha os dados para se registrar"
              : "Entre com suas credenciais"}
          </Text>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap="4">
              {isRegister && (
                <Field label="Nome" required>
                  <Input
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </Field>
              )}

              <Field label="E-mail" required>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </Field>

              <Field label="Senha" required>
                <PasswordInput
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                />
              </Field>

              <Stack gap="3" mt="2">
                <Button
                  type="submit"
                  colorPalette="blue"
                  width="full"
                  loading={isSubmitting}
                  loadingText={isRegister ? "Registrando..." : "Entrando..."}
                >
                  {isRegister ? "Registrar" : "Entrar"}
                </Button>

                <Button
                  variant="ghost"
                  width="full"
                  onClick={toggleMode}
                  disabled={isSubmitting}
                >
                  {isRegister ? "Já tenho uma conta" : "Criar uma conta"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}
