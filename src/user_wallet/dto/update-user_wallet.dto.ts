import { PartialType } from '@nestjs/mapped-types';
import { CreateUserWalletDto } from './create-user_wallet.dto';

export class UpdateUserWalletDto extends PartialType(CreateUserWalletDto) {}
