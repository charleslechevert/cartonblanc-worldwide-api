import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { Register } from './register.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Register]), // import TypeOrmModule for Register
    JwtModule.register({
      secret: 'secret', // you can use the same secret key
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RegisterController], // RegisterController instead of TeamController
  providers: [RegisterService], // RegisterService instead of TeamService
})
export class RegisterModule {}
