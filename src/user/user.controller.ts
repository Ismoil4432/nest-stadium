import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Foydalanuvchilar')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: "Barcha Foydalanuvchilarni ko'rish" })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: "Foydalanuvchini ID bo'yicha olish" })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: "Foydalanuvchini ID bo'yicha o'chirish" })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @ApiOperation({ summary: "Foydalanuvchini yaratish" })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: "Foydalanuvchini email bo'yicha olish" })
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @ApiOperation({ summary: "Foydalanuvchini aktiv qilish" })
  @Post('activate')
  async activateUser(@Body() activateUserDto: ActivateUserDto) {
    return this.userService.activateUser(activateUserDto);
  }

  @ApiOperation({ summary: "Foydalanuvchini deaktiv qilish" })
  @Post('deactivate')
  async deactivateUser(@Body() activateUserDto: ActivateUserDto) {
    return this.userService.deactivateUser(activateUserDto);
  }
}
