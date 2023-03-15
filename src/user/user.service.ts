import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { ActivateUserDto } from './dto/activate-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User) { }

  async findAll() {
    const user = await this.userRepository.findAll({ include: { all: true } });
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      include: { all: true }
    });
    return user;
  }

  async delete(id: number) {
    const user = await this.userRepository.destroy({ where: { id } });
    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    return { message: "Foydalanuvchi o'chirildi" };
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    return newUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true }
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
