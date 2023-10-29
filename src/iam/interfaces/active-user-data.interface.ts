import { Role } from "../../roles/entities/role.entity";

export interface ActiveUserData {
  sub: number;
  email: string;
  roles: Role[];
}