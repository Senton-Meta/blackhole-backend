import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SandboxService } from './sandbox.service';

@Controller()
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Get()
  testRole() {
    return this.sandboxService.testRole();
  }
}
