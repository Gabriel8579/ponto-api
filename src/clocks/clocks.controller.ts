import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import User from 'src/users/entities/user.entity';
import { ClocksService } from './clocks.service';

@Controller('clocks')
@UseGuards(AuthGuard())
export class ClocksController {

   constructor(
      private clocksService: ClocksService,
   ) {}

   @Post()
   createClock(@GetUser() issuer: User) {
      return this.clocksService.createClock(issuer);
   }

}
