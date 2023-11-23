import { ConflictException, Injectable } from "@nestjs/common";
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import {In, Repository} from "typeorm";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = new Role();
      role.name = createRoleDto.name;
      role.level = createRoleDto.level;

      await this.rolesRepository.save(role);
    } catch (err) {
      const pgUniqueViolationErrorCode = "23505";
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findAllByName(roleNames: string[]) {
    return this.rolesRepository.find({
      where: [
        { name: In(roleNames) },
      ],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
