import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { AttatchmentsService } from './attatchments.service';
import { S3Service } from 'src/s3/s3.service';

@Controller('attachments')
export class AttatchmentsController {
  constructor(
    private readonly attatchmentsService: AttatchmentsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('userId') userId?: string,
    @Body('commentId') commentId?: string,
    @Body('taskId') taskId?: string,
  ) {
    console.log(files);
    return this.attatchmentsService.create({
      files,
      userId,
      commentId,
      taskId,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.attatchmentsService.delete(id);
  }
}
