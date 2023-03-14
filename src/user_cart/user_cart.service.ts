import { Injectable } from '@nestjs/common';
import { CreateUserCartDto } from './dto/create-user_cart.dto';
import { UpdateUserCartDto } from './dto/update-user_cart.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UserCart } from './models/user_cart.model';

@Injectable()
export class UserCartService {
  constructor(@InjectModel(UserCart) private userCartRepo: typeof UserCart) { }
  
  create(createUserCartDto: CreateUserCartDto) {
    return 'This action adds a new userCart';
  }

  findAll() {
    return `This action returns all userCart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCart`;
  }

  update(id: number, updateUserCartDto: UpdateUserCartDto) {
    return `This action updates a #${id} userCart`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCart`;
  }
}
