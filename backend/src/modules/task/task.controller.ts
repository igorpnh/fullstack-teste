import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@ApiCookieAuth('token')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova task' })
  @ApiResponse({ status: 201, description: 'Task criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tasks' })
  @ApiResponse({ status: 200, description: 'Lista de tasks paginada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(@Query() query: QueryTaskDto) {
    return this.taskService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma task por ID' })
  @ApiResponse({ status: 200, description: 'Task encontrada' })
  @ApiResponse({ status: 404, description: 'Task não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma task' })
  @ApiResponse({ status: 200, description: 'Task atualizada' })
  @ApiResponse({ status: 404, description: 'Task não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma task' })
  @ApiResponse({ status: 204, description: 'Task removida' })
  @ApiResponse({ status: 404, description: 'Task não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.taskService.remove(id);
  }
}
