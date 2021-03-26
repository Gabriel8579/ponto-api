import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ClocksController } from './clocks.controller';
import { ClocksService } from './clocks.service';
import ClockRepository from './repositories/clock.repository';

@Module({
   providers: [ClocksService],
   controllers: [ClocksController],
   imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      TypeOrmModule.forFeature([
         ClockRepository,
         UserRepository
      ])
   ],
})
export class ClocksModule {}
