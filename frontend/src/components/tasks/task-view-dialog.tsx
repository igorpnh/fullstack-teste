import { Badge, Button, Stack } from "@chakra-ui/react";

import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from "../ui/dialog";
import { DataListItem, DataListRoot } from "../ui/data-list";
import { Task, TaskStatus, TASK_STATUS_LABELS } from "../../types/task";

const STATUS_COLOR: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "yellow",
  [TaskStatus.IN_PROGRESS]: "blue",
  [TaskStatus.COMPLETED]: "green",
};

interface TaskViewDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
}

export function TaskViewDialog({ open, task, onClose }: TaskViewDialogProps) {
  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
      size="lg"
    >
      <DialogContent maxW="lg" overflow="hidden">
        <DialogHeader>
          <DialogTitle>Detalhes da Tarefa</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          {task && (
            <Stack gap="4">
              <DataListRoot orientation="horizontal">
                <DataListItem
                  label="Criada em"
                  value={new Date(task.createdAt).toLocaleString("pt-BR")}
                />
                <DataListItem
                  label="Atualizada em"
                  value={new Date(task.updatedAt).toLocaleString("pt-BR")}
                />
                <DataListItem
                  label="Status"
                  value={
                    <Badge colorPalette={STATUS_COLOR[task.status]} size="sm">
                      {TASK_STATUS_LABELS[task.status]}
                    </Badge>
                  }
                />
                <DataListItem label="Título" value={task.title} />
                <DataListItem
                  label="Descrição"
                  value={task.description}
                  color="fg"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  overflowWrap="anywhere"
                />
              </DataListRoot>
            </Stack>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Fechar</Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
