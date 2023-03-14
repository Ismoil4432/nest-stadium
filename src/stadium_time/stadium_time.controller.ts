import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { StadiumTimeService } from './stadium_time.service';
import { CreateStadiumTimeDto } from './dto/create-stadium_time.dto';
import { UpdateStadiumTimeDto } from './dto/update-stadium_time.dto';

@Controller('stadium_time')
export class StadiumTimeController {
  constructor(private readonly stadiumTimeService: StadiumTimeService) { }

  @Post()
  create(@Body() createStadiumTimeDto: CreateStadiumTimeDto) {
    return this.stadiumTimeService.create(createStadiumTimeDto);
  }

  @Get()
  findAll() {
    return this.stadiumTimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stadiumTimeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStadiumTimeDto: UpdateStadiumTimeDto) {
    return this.stadiumTimeService.update(+id, updateStadiumTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stadiumTimeService.remove(+id);
  }
}
