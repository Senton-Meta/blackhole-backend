import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SandboxService } from './sandbox.service';
import {Roles} from "../iam/authorization/decorators/roles.decorator";

@Controller()
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Roles({
    id: 2,
    name: "user-pro",
    level: 2
  })
  @Get()
  testRole() {
    return this.sandboxService.testRole();
  }
}
