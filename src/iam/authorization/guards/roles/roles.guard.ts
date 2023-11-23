import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {Role} from "../../../../roles/entities/role.entity";
import {ROLES_KEY} from "../../decorators/roles.decorator";
import {ActiveUserData} from "../../../interfaces/active-user-data.interface";
import {REQUEST_USER_KEY} from "../../../iam.constants";
import {RolesService} from "../../../../roles/roles.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const contextRoles: string[] = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRoles) return true;

    const requiredRoles: Role[] = await this.rolesService.findAllByName(contextRoles);

    const user: ActiveUserData = context.switchToHttp()
      .getRequest()[REQUEST_USER_KEY];

    return requiredRoles.some((requiredRole) => {
      return user.roles.some((role) => {
        return role.id === requiredRole.id;
      });
    });
  }
}
