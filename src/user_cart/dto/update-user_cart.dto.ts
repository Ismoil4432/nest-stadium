import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCartDto } from './create-user_cart.dto';

export class UpdateUserCartDto extends PartialType(CreateUserCartDto) {}
