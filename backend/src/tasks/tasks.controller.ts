import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.taskService.fetchTaskDetails(id);
  }

  @Get()
  async find(@Query('userId') userId?: string, @Query('level') level?: number) {
    return this.taskService.findAll(userId, level);
  }

  @Post()
  async create(@Body() body: CreateTaskDto) {
    return this.taskService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    return this.taskService.update(id, body);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}
