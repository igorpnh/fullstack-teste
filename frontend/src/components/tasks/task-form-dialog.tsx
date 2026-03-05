"use client";

import { Button, Input, Stack, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogActionTrigger,
} from "../ui/dialog";
import { NativeSelectField, NativeSelectRoot } from "../ui/native-select";
import { Field } from "../ui/field";
import { toaster } from "../ui/toaster";
import { api, ApiError } from "../../lib/api";
import { Task, TaskStatus, TASK_STATUS_LABELS } from "../../types/task";

const statusOptions = Object.values(TaskStatus).map((s) => ({
  value: s,
  label: TASK_STATUS_LABELS[s],
}));

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSaved: () => void;
}

export function TaskDialog({ open, task, onClose, onSaved }: TaskDialogProps) {
  const isEditing = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus(TaskStatus.PENDING);
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toaster.error({ title: "Preencha todos os campos" });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await api(`/tasks/${task.id}`, {
          method: "PATCH",
          body: { title, description, status },
        });
        toaster.success({ title: "Tarefa atualizada com sucesso!" });
      } else {
        await api("/tasks", {
          method: "POST",
          body: { title, description },
        });
        toaster.success({ title: "Tarefa criada com sucesso!" });
      }
      onSaved();
      onClose();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Ocorreu um erro inesperado";
      toaster.error({ title: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />

        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Stack gap="4">
              <Field label="Título" required>
                <Input
                  placeholder="Título da tarefa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>

              <Field label="Descrição" required>
                <Textarea
                  placeholder="Descreva a tarefa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </Field>

              {isEditing && (
                <Field label="Status">
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskStatus)}
                      items={statusOptions}
                    />
                  </NativeSelectRoot>
                </Field>
              )}
            </Stack>
          </DialogBody>

          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogActionTrigger>
            <Button
              type="submit"
              colorPalette="purple"
              loading={isSubmitting}
              loadingText={isEditing ? "Salvando..." : "Criando..."}
            >
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
