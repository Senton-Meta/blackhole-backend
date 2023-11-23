import { Injectable } from '@nestjs/common';

@Injectable()
export class SandboxService {
  testRole() {
    return 'This action checks user-pro role';
  }
}
