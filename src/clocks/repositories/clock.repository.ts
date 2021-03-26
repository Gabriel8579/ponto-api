import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import User from "src/users/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import Clock from "../entities/clock.entity";

@EntityRepository(Clock)
export default class ClockRepository extends Repository<Clock> {
   
   private logger = new Logger('ClockRepository');

   async createClock(issuer: User): Promise<void> {
      const date = new Date();

      if (this.findClockByUserAndDateTime(issuer, date)) {
         throw new ConflictException("There is already a clock in this time!")
      }

      const clock = new Clock();

      clock.time = new Date();
      clock.user = issuer;

      try {
         clock.save();
      } catch (error) {
         this.logger.error(error);
         throw new InternalServerErrorException(error);
      }
   }

   private async findClockByUserAndDateTime(user: User, date: Date): Promise<Clock> {
      const clock = this.findOne({ user: user, time: date})

      return clock;
   }

}