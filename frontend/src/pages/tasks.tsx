import {
  Badge,
  Box,
  Button,
  Card,
  createListCollection,
  EmptyState,
  Flex,
  IconButton,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
  LuClipboardList,
  LuEye,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
  LuX,
} from "react-icons/lu";

import { InputGroup } from "../components/ui/input-group";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../components/ui/pagination";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../components/ui/select";
import { toaster } from "../components/ui/toaster";
import { TaskDialog } from "../components/tasks/task-form-dialog";
import { TaskViewDialog } from "../components/tasks/task-view-dialog";
import { TaskDeleteDialog } from "../components/tasks/task-delete-dialog";
import { api, ApiError } from "../lib/api";
import {
  Task,
  TaskStatus,
  TASK_STATUS_LABELS,
  PaginatedTasks,
} from "../types/task";

const statusOptions = [
  { value: "", label: "Todos os status" },
  ...Object.values(TaskStatus).map((s) => ({
    value: s,
    label: TASK_STATUS_LABELS[s],
  })),
];

const STATUS_COLOR: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "yellow",
  [TaskStatus.IN_PROGRESS]: "blue",
  [TaskStatus.COMPLETED]: "green",
};

const statusCollection = createListCollection({ items: statusOptions });

const ITEMS_PER_PAGE = 6;

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(ITEMS_PER_PAGE));
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const result = await api<PaginatedTasks>(`/tasks?${params.toString()}`);
      setTasks(result.data);
      setTotalItems(result.total);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Erro ao carregar tarefas";
      toaster.error({ title: message });
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const openDeleteDialog = (task: Task) => {
    setDeletingTask(task);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingTask(null);
  };

  const openCreateDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const openViewDialog = (task: Task) => {
    setViewingTask(task);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setViewingTask(null);
  };

  return (
    <Flex
      direction="column"
      minH="calc(100vh - 64px)"
      maxW="6xl"
      mx="auto"
      px="4"
      py="6"
    >
      {/* Filtros */}
      <Card.Root p="4" mb="6">
        <Flex
          direction={{ base: "column", md: "row" }}
          gap="3"
          align={{ md: "center" }}
          justify="space-between"
        >
          <Flex gap="3" flex="1" direction={{ base: "column", sm: "row" }}>
            <InputGroup
              flex="1"
              minW="0"
              startElement={<LuSearch />}
              endElement={
                search ? (
                  <IconButton
                    aria-label="Limpar busca"
                    variant="ghost"
                    size="2xs"
                    onClick={() => setSearch("")}
                  >
                    <LuX />
                  </IconButton>
                ) : undefined
              }
              endElementProps={{ pointerEvents: "auto" }}
            >
              <Input
                placeholder="Buscar por título ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <SelectRoot
              collection={statusCollection}
              value={statusFilter ? [statusFilter] : [""]}
              onValueChange={(e) => setStatusFilter(e.value[0] ?? "")}
              size="md"
              width={{ base: "full", sm: "180px" }}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} item={opt}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </Flex>

          <Button colorPalette="purple" size="sm" onClick={openCreateDialog}>
            <LuPlus />
            Nova Tarefa
          </Button>
        </Flex>
      </Card.Root>

      {/* Lista de tarefas */}
      {isLoading ? (
        <Flex justify="center" py="12">
          <Spinner size="lg" />
        </Flex>
      ) : tasks?.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuClipboardList />
            </EmptyState.Indicator>
            <EmptyState.Title>
              {!search && !statusFilter
                ? "Nenhuma tarefa encontrada"
                : "Nenhuma tarefa corresponde aos filtros"}
            </EmptyState.Title>
            <EmptyState.Description>
              {!search && !statusFilter
                ? "Crie sua primeira tarefa clicando no botão acima."
                : "Tente ajustar os filtros de busca."}
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <Stack gap="3">
          {tasks?.map((task) => (
            <Card.Root key={task.id} variant="outline">
              <Card.Body p="4">
                <Flex justify="space-between" align="start" gap="4">
                  <Box flex="1" minW="0">
                    <Flex align="center" gap="2" mb="1">
                      <Text fontWeight="semibold" color="fg" truncate>
                        {task.title}
                      </Text>
                      <Badge colorPalette={STATUS_COLOR[task.status]} size="sm">
                        {TASK_STATUS_LABELS[task.status]}
                      </Badge>
                    </Flex>
                    <Text color="fg.muted" fontSize="sm" lineClamp={2}>
                      {task.description}
                    </Text>
                  </Box>

                  <Flex gap="1" flexShrink={0}>
                    <IconButton
                      aria-label="Ver tarefa"
                      variant="ghost"
                      size="sm"
                      onClick={() => openViewDialog(task)}
                    >
                      <LuEye />
                    </IconButton>
                    <IconButton
                      aria-label="Editar tarefa"
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(task)}
                    >
                      <LuPencil />
                    </IconButton>
                    <IconButton
                      aria-label="Excluir tarefa"
                      variant="ghost"
                      size="sm"
                      colorPalette="red"
                      onClick={() => openDeleteDialog(task)}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </Flex>
                </Flex>
              </Card.Body>
            </Card.Root>
          ))}
        </Stack>
      )}

      {/* Paginação */}
      <Box flex="1" />
      {!isLoading && totalItems > 0 && (
        <Flex justify="center" mt="8" pb="2">
          <PaginationRoot
            count={totalItems}
            pageSize={ITEMS_PER_PAGE}
            page={page}
            onPageChange={(e) => setPage(e.page)}
          >
            <Flex gap="1" align="center">
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </Flex>
            <PaginationPageText
              format="long"
              fontSize="sm"
              mt="2"
              textAlign="center"
            />
          </PaginationRoot>
        </Flex>
      )}

      {/* Dialog de visualização */}
      <TaskViewDialog
        open={viewDialogOpen}
        task={viewingTask}
        onClose={closeViewDialog}
      />

      {/* Dialog de criação/edição */}
      <TaskDialog
        open={dialogOpen}
        task={editingTask}
        onClose={closeDialog}
        onSaved={fetchTasks}
      />

      {/* Dialog de confirmação de exclusão */}
      <TaskDeleteDialog
        open={deleteDialogOpen}
        task={deletingTask}
        onClose={closeDeleteDialog}
        onDeleted={fetchTasks}
      />
    </Flex>
  );
}
