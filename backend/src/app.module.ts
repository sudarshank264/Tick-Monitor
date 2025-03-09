import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { RolesModule } from './roles/roles.module';
import { DomainModule } from './domain/domain.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { AttatchmentsModule } from './attatchments/attatchments.module';
import { TasklogModule } from './tasklog/tasklog.module';
import { Task } from './tasks/entity/tasks.entity';
import { Comment } from './comments/entities/comment.entity';
import { Attatchment } from './attatchments/entities/attatchment.entity';
import { Tasklog } from './tasklog/entities/tasklog.entity';
import { VerticesModule } from './vertices/vertices.module';
import { Vertex } from './vertices/entities/vertex.entity';
import { S3Module } from './s3/s3.module';
import { Domain } from './domain/entities/domain.entity';
import { Role } from './roles/entity/roles.entity';
import { TaskUser } from './tasks/entity/task-user.entity';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

// LOCAL
const localDB = {
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'tickmonitor-db',
};

const DBConfig = process.env.USE_LOCAL === 'true' ? localDB : localDB;

console.log(process.env.USE_LOCAL === 'true' ? 'LocalDB' : 'HostedDB');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...DBConfig,
      entities: [
        User,
        Comment,
        Task,
        Attatchment,
        Tasklog,
        Vertex,
        Domain,
        Role,
        TaskUser,
      ],
      synchronize: true,
      // dropSchema: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    DomainModule,
    TasksModule,
    CommentsModule,
    AttatchmentsModule,
    TasklogModule,
    VerticesModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
