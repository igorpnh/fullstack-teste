import { useState } from "react";
import { Button, Text } from "@chakra-ui/react";

import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from "../ui/dialog";
import { toaster } from "../ui/toaster";
import { api, ApiError } from "../../lib/api";
import { Task } from "../../types/task";

interface TaskDeleteDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onDeleted: () => void;
}

export function TaskDeleteDialog({
  open,
  task,
  onClose,
  onDeleted,
}: TaskDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await api(`/tasks/${task.id}`, { method: "DELETE" });
      toaster.success({ title: "Tarefa excluída com sucesso!" });
      onDeleted();
      onClose();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Erro ao excluir tarefa";
      toaster.error({ title: message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
      role="alertdialog"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Tarefa</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text color="fg">
            Tem certeza que deseja excluir a tarefa{" "}
            <Text as="span" fontWeight="semibold">
              &ldquo;{task?.title}&rdquo;
            </Text>
            ? Essa ação não pode ser desfeita.
          </Text>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogActionTrigger>
          <Button
            colorPalette="red"
            onClick={handleDelete}
            loading={isDeleting}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
