import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
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
      where: { id: id },
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
}
