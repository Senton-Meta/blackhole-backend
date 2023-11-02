import {BadGatewayException, Injectable} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {UpdateUserRolesDto} from "./dto/update-user-roles.dto";
import {Role} from "../roles/entities/role.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {
  }

  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  findAll() {

    return this.usersRepository.find({
      relations: {
        roles: true
      }
    });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: {id: id},
      relations: {
        roles: true,
      }
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async updateRoles(id: number, updateUserRolesDto: UpdateUserRolesDto) {
    try {

      const roles: Role[] = await Promise.all(updateUserRolesDto.rolesId.map(async (roleId): Promise<Role> => {
        let role = await this.rolesRepository.findOneOrFail({
          where: { id: roleId },
        })

        if (!role) {
          throw new BadGatewayException(`Роль id=${roleId} не найдена`)
        }

        return role;
      }))


      roles.map((role) => {
        console.log(role.name)
      })


      const userToUpdate = await this.usersRepository.findOne({
        where: {id: id},
        relations: { roles: true }
      })

      userToUpdate.roles = roles;

      await this.usersRepository.save(userToUpdate);
    } catch (err) {
      throw err
    }
  }
}
