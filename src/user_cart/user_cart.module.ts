import { Module } from '@nestjs/common';
import { UserCartService } from './user_cart.service';
import { UserCartController } from './user_cart.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserCart } from './models/user_cart.model';

@Module({
  imports: [SequelizeModule.forFeature([UserCart])],
  controllers: [UserCartController],
  providers: [UserCartService],
  exports: [UserCartService]
})
export class UserCartModule {}
