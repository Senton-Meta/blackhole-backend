import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from "../iam/decorators/active-user.decorator";
import { ActiveUserData } from "../iam/interfaces/active-user-data.interface";
import {UpdateUserRolesDto} from "./dto/update-user-roles.dto";
import { Roles } from "../iam/authorization/decorators/roles.decorator";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserData) {
    console.log(user);
    return this.usersService.findAll();
  }

  @Roles(['user-pro'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch(':id/roles')
  updateRoles(@Param('id') id: string, @Body() updateUserRolesDto: UpdateUserRolesDto) {
    return this.usersService.updateRoles(+id, updateUserRolesDto);
  }
}
