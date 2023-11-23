import {Body, Controller, Get} from '@nestjs/common';
import {SandboxService} from './sandbox.service';
import {Roles} from "../iam/authorization/decorators/roles.decorator";
import {InjectRepository} from "@nestjs/typeorm";
import {Role} from "../roles/entities/role.entity";
import {Repository} from "typeorm";
import {RolesService} from "../roles/roles.service";

@Controller()
export class SandboxController {
  constructor(
    private readonly sandboxService: SandboxService,
    private readonly rolesService: RolesService,
  ) {
  }

  @Roles(['user-pro'])
  @Get()
  testRole() {
    return this.sandboxService.testRole();
  }

  @Get('names')
  rolesByName(
    @Body() roleNames
  ) {
    return this.rolesService.findAllByName(roleNames);
  }
}
