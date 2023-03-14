import { Injectable } from '@nestjs/common';
import { CreateStadiumTimeDto } from './dto/create-stadium_time.dto';
import { UpdateStadiumTimeDto } from './dto/update-stadium_time.dto';
import { InjectModel } from '@nestjs/sequelize';
import { StadiumTime } from './models/stadium_time.model';

@Injectable()
export class StadiumTimeService {
  constructor(@InjectModel(StadiumTime) private stadiumTimeRepo: typeof StadiumTime) { }

  create(createStadiumTimeDto: CreateStadiumTimeDto) {
    return 'This action adds a new stadiumTime';
  }

  findAll() {
    return `This action returns all stadiumTime`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stadiumTime`;
  }

  update(id: number, updateStadiumTimeDto: UpdateStadiumTimeDto) {
    return `This action updates a #${id} stadiumTime`;
  }

  remove(id: number) {
    return `This action removes a #${id} stadiumTime`;
  }
}
