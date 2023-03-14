import { PartialType } from '@nestjs/mapped-types';
import { CreateComfortDto } from './create-comfort.dto';

export class UpdateComfortDto extends PartialType(CreateComfortDto) {}
