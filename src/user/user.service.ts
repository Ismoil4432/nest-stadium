import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { ActivateUserDto } from './dto/activate-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4, v4 } from 'uuid';
import { LoginUserDto } from './dto/login-user.dto';
import { MailService } from './../mail/mail.service';

interface IUpdateUser {
  id: number;
  hashed_refresh_token: string;
  activation_link?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) { }

  async registration(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userRepository.findOne({
      where: { username: createUserDto.username }
    })
    if (user) {
      throw new BadRequestException('Username already exists!');
    }
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Passwords do not match!');
    }

    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.userRepository.create({
      ...createUserDto,
      hashed_password
    })

    const tokens = await this.getTokens(newUser);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const uniqueKey: string = uuidv4();

    const updatedUser = await this.userRepository.update(
      {
        hashed_refresh_token,
        activation_link: uniqueKey
      },
      {
        where: { id: newUser.id },
        returning: true
      }
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

  async login(loginUserDto: LoginUserDto, res: Response) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email }
    })
    if (!user) {
      throw new UnauthorizedException('User not registered');
    }
    const isMatchPass = await bcrypt.compare(password, user.hashed_password);
    if (!isMatchPass) {
      throw new UnauthorizedException('User not registered(pass)');
    }

    const tokens = await this.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    const updatedUser = await this.userRepository.update(
      {
        hashed_refresh_token
      },
      {
        where: { id: user.id },
        returning: true
      }
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

  async logout(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY
    });
    if (!userData) {
      throw new ForbiddenException('User not found');
    }
    const updateUser = await this.userRepository.update(
      { hashed_refresh_token: null },
      { where: { id: userData.id }, returning: true }
    );
    res.clearCookie('refresh_token');
    const response = {
      message: 'User logged out successfully',
      user: updateUser[1][0]
    }
    return response;
  }

  async activate(link: string) {
    const updatedUser = await this.userRepository.update(
      { is_active: true },
      { where: { activation_link: link, is_active: false }, returning: true }
    );

    const response = {
      message: 'User activated successfully',
      user: updatedUser[1][0]
    }
    return response;
  }

  async refreshToken(user_id: number, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);
    if (user_id != decodedToken['id']) {
      throw new BadRequestException('User not found');
    }
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user || user.hashed_refresh_token) {
      throw new BadRequestException('User not found');
    }
    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_password
    );

    if (!tokenMatch) {
      throw new ForbiddenException('Forbidden');
    }

    const tokens = await this.getTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.userRepository.update(
      {
        hashed_refresh_token
      },
      {
        where: { id: user.id },
        returning: true
      }
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true
    })
    const response = {
      message: 'User refreshed',
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













  async findAll() {
    const user = await this.userRepository.findAll({ include: { all: true } });
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      include: { all: true }
    });
    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async delete(id: number) {
    const user = await this.userRepository.destroy({ where: { id } });
    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    return { message: "Foydalanuvchi o'chirildi" };
  }

  async createUser(createUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    return newUser;
  }

  // async updateUser(
  //   user: IUpdateUser,
  //   options?: {
  //     where?: { id: number },
  //     returning?: boolean,
  //   }
  // ) {
  //   const updatedUser = await this.userRepository.update(
  //     {
  //       hashed_refresh_token,
  //       activation_link: uniqueKey
  //     },
  //     {
  //       where: { id },
  //       returning: true
  //     });
  //   return updatedUser;
  // }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email }
    });
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username }
    });
    return user;
  }

  async activateUser(activateUserDto: ActivateUserDto) {
    const user = await this.userRepository.findByPk(activateUserDto.user_id);

    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }

    user.is_active = true;
    await user.save();
    return user;
  }

  async deactivateUser(activateUserDto: ActivateUserDto) {
    const user = await this.userRepository.findByPk(activateUserDto.user_id);

    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }

    user.is_active = false;
    await user.save();
    return user;
  }
}
