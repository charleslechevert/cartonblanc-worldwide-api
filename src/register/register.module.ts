import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { Register } from './register.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Register]), // import TypeOrmModule for Register
  ],
  controllers: [RegisterController], // RegisterController instead of TeamController
  providers: [RegisterService], // RegisterService instead of TeamService
})
export class RegisterModule {}
