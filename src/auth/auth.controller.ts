import { Controller, Post, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response } from 'express';
import { User } from '../user/models/user.model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @ApiOperation({ summary: "Login qilish" })
  // @ApiResponse({ status: 200, type: User })
  // @HttpCode(HttpStatus.OK)
  // @Post('signin')
  // async login(
  //   @Body() loginAuthDto: LoginAuthDto,
  //   @Res({ passthrough: true }) res: Response
  // ) {
  //   return this.authService.login(loginAuthDto, res);
  // }

  // @ApiOperation({ summary: "Register qilish" })
  // @ApiResponse({ status: 201, type: User })
  // @Post('signup')
  // async registration(
  //   @Body() createUserDto: CreateUserDto,
  //   @Res({ passthrough: true }) res: Response
  // ) {
  //   return this.authService.registration(createUserDto, res);
  // }
}
