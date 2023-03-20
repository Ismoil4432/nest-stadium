import { Controller, Get, Post, Body, Param, Delete, UseGuards, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './models/user.model';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { CookieGetter } from '../decorators/cookieGetter.decorator';

@ApiTags('Foydalanuvchilar')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: "Ro'yxatdan o'tish" })
  @ApiResponse({ status: 201, type: User })
  @Post('signup')
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.userService.registration(createUserDto, res);
  }

  @ApiOperation({ summary: "Logindan o'tish" })
  @ApiResponse({ status: 200, type: User })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.userService.login(loginUserDto, res);
  }

  @ApiOperation({ summary: "Logout qilish" })
  @ApiResponse({ status: 200, type: User })
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async logout(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.userService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: "Activate user" })
  @ApiResponse({ status: 200, type: [User] })
  @Get('activate/:link')
  async activate(@Param('link') link: string) {
    return this.userService.activate(link);
  }

  @ApiOperation({ summary: "Activate user" })
  @ApiResponse({ status: 200, type: [User] })
  @Get(':id/refresh')
  async refresh(
    @Param('id') id: string,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.userService.refreshToken(+id, refreshToken, res);
  }

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
