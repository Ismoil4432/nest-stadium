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
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { decode, encode } from '../helpers/crypto';
import { Otp } from '../otp/models/otp.model';
import { dates } from './../helpers/crypto';
import { PhoneUserDto } from './dto/phone-user.dto';
import * as otpGenerator from 'otp-generator';
import { BotService } from '../bot/bot.service';
import { AddMinutesToDate } from '../helpers/addMinutes';
import { Op } from 'sequelize';
import { FindUserDto } from './dto/find-user.dto';

interface IUpdateUser {
  id: number;
  hashed_refresh_token: string;
  activation_link?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    @InjectModel(Otp) private otpRepo: typeof Otp,
    private readonly botService: BotService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) { }

  async registration(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userRepo.findOne({
      where: { username: createUserDto.username }
    })
    if (user) {
      throw new BadRequestException('Username already exists!');
    }
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Passwords do not match!');
    }

    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.userRepo.create({
      ...createUserDto,
      hashed_password
    })

    const tokens = await this.getTokens(newUser);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const uniqueKey: string = uuidv4();

    const updatedUser = await this.userRepo.update(
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
    const user = await this.userRepo.findOne({
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

    const updatedUser = await this.userRepo.update(
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
    const updateUser = await this.userRepo.update(
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
    const updatedUser = await this.userRepo.update(
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
    const user = await this.userRepo.findOne({ where: { id: user_id } });
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
    const updatedUser = await this.userRepo.update(
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

  async newOtp(phoneUserDto: PhoneUserDto) {
    const phone_number = phoneUserDto.phone;
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const isSend = await this.botService.sendOTP(phone_number, otp);
    if (!isSend) {
      throw new HttpException(
        "Avval Botdan ro'yhatdan o'ting",
        HttpStatus.BAD_REQUEST,
      );
    }
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);
    await this.otpRepo.destroy({
      where: { [Op.and]: [{ check: phone_number }, { verified: false }] },
    });
    const newOtp = await this.otpRepo.create({
      id: v4(),
      otp,
      expiration_time,
      check: phone_number,
    });
    const details = {
      timestamp: now,
      check: phone_number,
      success: true,
      message: 'OTP sent to user',
      otp_id: newOtp.id,
    };
    const encoded = await encode(JSON.stringify(details));
    return { status: 'Success', Details: encoded };
  }


  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, otp, check } = verifyOtpDto;
    const currentDate = new Date();
    const decoded = await decode(verification_key);
    const obj = JSON.parse(decoded);
    const check_obj = obj.check;
    if (check_obj != check) {
      throw new BadRequestException('OTP bu raqamga yuborilmagan');
    }
    const result = await this.otpRepo.findOne({
      where: { id: obj.otp_id }
    });

    if (result != null) {
      if (!result.verified) {
        if (dates.compare(result.expiration_time, currentDate)) {
          if (otp === result.otp) {
            const user = await this.userRepo.findOne({
              where: { phone: check }
            });
            if (user) {
              const updatedUser = await this.userRepo.update(
                { is_owner: true },
                { where: { id: user.id }, returning: true }
              );
              await this.otpRepo.update(
                { verified: true },
                { where: { id: obj.otp_id }, returning: true }
              );
              const response = {
                message: 'User updated as owner',
                user: updatedUser[1][0]
              };
              return response;
            }
          } else {
            throw new BadRequestException('OTP does not match');
          }
        } else {
          throw new BadRequestException('OTP expired');
        }
      } else {
        throw new BadRequestException('OTP already used');
      }
    } else {
      throw new BadRequestException('User not found');
    }
  }











  async findAll(findUserDto: FindUserDto) {
    const where = {};
    if (findUserDto.first_name) {
      where['first_name'] = {
        [Op.iLike]: `%${findUserDto.first_name}%`
      };
    }
    if (findUserDto.last_name) {
      where['last_name'] = {
        [Op.iLike]: `%${findUserDto.last_name}%`
      };
    }
    if (findUserDto.username) {
      where['username'] = {
        [Op.iLike]: `%${findUserDto.username}%`
      };
    }
    if (findUserDto.email) {
      where['email'] = {
        [Op.iLike]: `%${findUserDto.email}%`
      };
    }
    if (findUserDto.phone) {
      where['phone'] = {
        [Op.iLike]: `%${findUserDto.phone}%`
      };
    }
    if (findUserDto.birth_day_from) {
      where['birth_day'] = {
        [Op.gte]: `${findUserDto.birth_day_from}`
      };
    }
    if (findUserDto.birth_day_to) {
      where['birth_day'] = {
        [Op.lte]: `${findUserDto.birth_day_to}`
      };
    }
    if (findUserDto.birth_day_from && findUserDto.birth_day_to) {
      where['birth_day'] = {
        [Op.between]: [findUserDto.birth_day_from, findUserDto.birth_day_to]
      };
    }
    if (findUserDto.is_active) {
      where['is_active'] = findUserDto.is_active;
    }
    if (findUserDto.is_owner) {
      where['is_owner'] = findUserDto.is_owner;
    }
    const user = await this.userRepo.findAll({
      where,
      include: { all: true }
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      include: { all: true }
    });
    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async delete(id: number) {
    const user = await this.userRepo.destroy({ where: { id } });
    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    return { message: "Foydalanuvchi o'chirildi" };
  }

  async createUser(createUserDto) {
    const newUser = await this.userRepo.create(createUserDto);
    return newUser;
  }

  // async updateUser(
  //   user: IUpdateUser,
  //   options?: {
  //     where?: { id: number },
  //     returning?: boolean,
  //   }
  // ) {
  //   const updatedUser = await this.userRepo.update(
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
    const user = await this.userRepo.findOne({
      where: { email }
    });
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepo.findOne({
      where: { username }
    });
    return user;
  }

  async activateUser(activateUserDto: ActivateUserDto) {
    const user = await this.userRepo.findByPk(activateUserDto.user_id);

    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }

    user.is_active = true;
    await user.save();
    return user;
  }

  async deactivateUser(activateUserDto: ActivateUserDto) {
    const user = await this.userRepo.findByPk(activateUserDto.user_id);

    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }

    user.is_active = false;
    await user.save();
    return user;
  }
}
