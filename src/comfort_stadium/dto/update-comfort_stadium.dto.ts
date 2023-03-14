import { PartialType } from '@nestjs/mapped-types';
import { CreateComfortStadiumDto } from './create-comfort_stadium.dto';

export class UpdateComfortStadiumDto extends PartialType(CreateComfortStadiumDto) {}
