import { Injectable } from '@nestjs/common';
import { CreateUserWalletDto } from './dto/create-user_wallet.dto';
import { UpdateUserWalletDto } from './dto/update-user_wallet.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UserWallet } from './models/user_wallet.model';

@Injectable()
export class UserWalletService {
  constructor(@InjectModel(UserWallet) private userWalletRepo: typeof UserWallet) { }

  create(createUserWalletDto: CreateUserWalletDto) {
    return 'This action adds a new userWallet';
  }

  findAll() {
    return `This action returns all userWallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userWallet`;
  }

  update(id: number, updateUserWalletDto: UpdateUserWalletDto) {
    return `This action updates a #${id} userWallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} userWallet`;
  }
}
