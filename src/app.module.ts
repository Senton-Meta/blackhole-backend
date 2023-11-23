import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';
import { RolesModule } from './roles/roles.module';
import {RouterModule} from "@nestjs/core";
import { SandboxModule } from './sandbox/sandbox.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    IamModule,
    SandboxModule,
    RouterModule.register([
      {
        path: 'users',
        module: UsersModule,
      },
      {
        path: 'roles',
        module: RolesModule,
      },
      {
        path: 'authentication',
        module: IamModule,
      },
      {
        path: 'sandbox',
        module: SandboxModule,
      }
    ]),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
