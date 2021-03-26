import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/users/repositories/user.repository';
import * as config from 'config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { SelectQueryBuilder } from 'typeorm';
import User from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      @InjectRepository(UserRepository)
      private userRepository: UserRepository,
   ) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      });
   }

   private logger = new Logger('JwtStrategy')

   async validate(payload: JwtPayload) {
      const query: SelectQueryBuilder<User> = this.userRepository.createQueryBuilder(
         'user',
      );
      query.where('user.username = :username', { username: payload.username });
      if (payload.company) {
         query.innerJoinAndSelect('user.company', 'company')
         query.andWhere('company.cnpj = :cnpj', { cnpj: payload.company })
      }

      const user = await query.getOne();

      this.logger.verbose(`Validating user JWT: ${JSON.stringify(payload)} Result: ${user ? 'valid' : 'invalid'}`)

      if (!user) {
         throw new UnauthorizedException();
      }

      if(!user.active) {
         throw new ForbiddenException('This user is inactive!')
      }

      return user;
   }
}
