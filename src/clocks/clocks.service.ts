import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';
import ClockRepository from './repositories/clock.repository';

@Injectable()
export class ClocksService {

   constructor(
      @InjectRepository(ClockRepository)
      private clockRepository: ClockRepository,
   ) {}

   private logger = new Logger('ClocksService')

   async createClock(issuer: User) {
      await this.clockRepository.createClock(issuer);
   }

}
