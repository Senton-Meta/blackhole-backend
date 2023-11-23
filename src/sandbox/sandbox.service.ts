import { Injectable } from '@nestjs/common';

@Injectable()
export class SandboxService {
  testRole() {
    return {
      "message": "buenas tardes!"
    };
  }
}
