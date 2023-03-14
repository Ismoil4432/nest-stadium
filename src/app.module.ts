import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { StadiumModule } from './stadium/stadium.module';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/models/admin.model';
import { MediaModule } from './media/media.module';
import { Media } from './media/models/media.model';
import { RegionModule } from './region/region.module';
import { Region } from './region/models/region.model';
import { DistrictModule } from './district/district.module';
import { District } from './district/models/district.model';
import { ComfortModule } from './comfort/comfort.module';
import { Comfort } from './comfort/models/comfort.model';
import { ComfortStadiumModule } from './comfort_stadium/comfort_stadium.module';
import { ComfortStadium } from './comfort_stadium/models/comfort_stadium.model';
import { CategoryModule } from './category/category.module';
import { Category } from './category/models/category.model';
import { UserModule } from './user/user.module';
import { User } from './user/models/user.model';
import { UserCartModule } from './user_cart/user_cart.module';
import { UserCart } from './user_cart/models/user_cart.model';
import { Stadium } from './stadium/models/stadium.model';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/models/comment.model';
import { StadiumTimeModule } from './stadium_time/stadium_time.module';
import { StadiumTime } from './stadium_time/models/stadium_time.model';
import { UserWalletModule } from './user_wallet/user_wallet.module';
import { UserWallet } from './user_wallet/models/user_wallet.model';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/models/cart.model';
import { OrderModule } from './order/order.module';
import { Order } from './order/models/order.model';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      models: [
        Admin,
        Media,
        Region,
        District,
        Comfort,
        ComfortStadium,
        Category,
        User,
        UserCart,
        Stadium,
        Comment,
        StadiumTime,
        UserWallet,
        Cart,
        Order
      ],
      autoLoadModels: true,
      logging: false
    }),
    StadiumModule,
    AdminModule,
    MediaModule,
    RegionModule,
    DistrictModule,
    ComfortModule,
    ComfortStadiumModule,
    CategoryModule,
    UserModule,
    UserCartModule,
    CommentModule,
    StadiumTimeModule,
    UserWalletModule,
    CartModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
