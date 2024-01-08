import { Module } from '@nestjs/common';
import { SandboxService } from './sandbox.service';
import { SandboxController } from './sandbox.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Role} from "../roles/entities/role.entity";
import {RolesService} from "../roles/roles.service";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../iam/authorization/guards/roles/roles.guard";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "../iam/config/jwt.config";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [SandboxController],
  providers: [
    SandboxService,
    RolesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class SandboxModule {}
