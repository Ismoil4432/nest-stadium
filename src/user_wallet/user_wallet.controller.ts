import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UserWalletService } from './user_wallet.service';
import { CreateUserWalletDto } from './dto/create-user_wallet.dto';
import { UpdateUserWalletDto } from './dto/update-user_wallet.dto';

@Controller('user_wallet')
export class UserWalletController {
  constructor(private readonly userWalletService: UserWalletService) {}

  @Post()
  create(@Body() createUserWalletDto: CreateUserWalletDto) {
    return this.userWalletService.create(createUserWalletDto);
  }

  @Get()
  findAll() {
    return this.userWalletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userWalletService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserWalletDto: UpdateUserWalletDto) {
    return this.userWalletService.update(+id, updateUserWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userWalletService.remove(+id);
  }
}
