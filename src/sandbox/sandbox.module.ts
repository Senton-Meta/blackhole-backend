import { Module } from '@nestjs/common';
import { SandboxService } from './sandbox.service';
import { SandboxController } from './sandbox.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Role} from "../roles/entities/role.entity";
import {RolesService} from "../roles/roles.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [SandboxController],
  providers: [SandboxService, RolesService],
})
export class SandboxModule {}
