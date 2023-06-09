import { Injectable } from '@nestjs/common';
import { CreateComfortStadiumDto } from './dto/create-comfort_stadium.dto';
import { UpdateComfortStadiumDto } from './dto/update-comfort_stadium.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ComfortStadium } from './models/comfort_stadium.model';

@Injectable()
export class ComfortStadiumService {
  constructor(@InjectModel(ComfortStadium) private comfortStadiumRepo: typeof ComfortStadium) { }
  
  create(createComfortStadiumDto: CreateComfortStadiumDto) {
    return 'This action adds a new comfortStadium';
  }

  findAll() {
    return `This action returns all comfortStadium`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comfortStadium`;
  }

  update(id: number, updateComfortStadiumDto: UpdateComfortStadiumDto) {
    return `This action updates a #${id} comfortStadium`;
  }

  remove(id: number) {
    return `This action removes a #${id} comfortStadium`;
  }
}
