import { PartialType } from '@nestjs/mapped-types';
import { CreateStadiumTimeDto } from './create-stadium_time.dto';

export class UpdateStadiumTimeDto extends PartialType(CreateStadiumTimeDto) {}
