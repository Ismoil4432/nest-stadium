import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


const start = async () => {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 4000;

    app.setGlobalPrefix('api');

    app.listen(PORT, () => {
      console.log(`Port: ${PORT}. Server is running...`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();