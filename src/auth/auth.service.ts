import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/models/user.model';
import { v4 as uuidv4, v4 } from 'uuid';
import { Response } from 'express';
import { where } from 'sequelize';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) { }

  async registration(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userService.getUserByUsername(createUserDto.username);
    const userEmail = await this.userService.getUserByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Username already exists!');
    }
    if (userEmail) {
      throw new BadRequestException('Email already registered!');
    }
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Passwords do not match!');
    }
    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.userService.createUser({
      ...createUserDto,
      hashed_password
    })
    const tokens = await this.getTokens(newUser);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const uniqueKey: string = uuidv4();
    const updatedUser = await this.userService.updateUser(
      {
        hashed_refresh_token,
        activation_link: uniqueKey
      },
      newUser.id
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true
    })
    await this.mailService.sendUserConfirmation(updatedUser[1][0]);
    const response = {
      message: 'User registered',
      user: updatedUser[1][0],
      tokens
    };
    return response;
  }

  async login(loginAuthDto: LoginAuthDto, res: Response) {
    const { email, password } = loginAuthDto;
    const user = await this.userService.getUserByEmail(email)
    if (!user) {
      throw new UnauthorizedException('User not registered');
    }
    const isMatchPass = await bcrypt.compare(password, user.hashed_password);
    if (!isMatchPass) {
      throw new UnauthorizedException('User not registered(pass)');
    }
    const tokens = await this.getTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.userService.updateUser(
      {
        hashed_refresh_token
      },
      user.id
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true
    })
    const response = {
      message: 'User logged in',
      user: updatedUser[1][0],
      tokens
    };
    return response;
  }

  async getTokens(user: User) {
    const jwtPayload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME
      })
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }
}
