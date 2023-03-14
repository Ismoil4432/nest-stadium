import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UserCartService } from './user_cart.service';
import { CreateUserCartDto } from './dto/create-user_cart.dto';
import { UpdateUserCartDto } from './dto/update-user_cart.dto';

@Controller('user_cart')
export class UserCartController {
  constructor(private readonly userCartService: UserCartService) {}

  @Post()
  create(@Body() createUserCartDto: CreateUserCartDto) {
    return this.userCartService.create(createUserCartDto);
  }

  @Get()
  findAll() {
    return this.userCartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCartService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserCartDto: UpdateUserCartDto) {
    return this.userCartService.update(+id, updateUserCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCartService.remove(+id);
  }
}
