import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repositories/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

   constructor(
      @InjectRepository(UserRepository)
      private userRepository: UserRepository,
      private jwtService: JwtService,
   ) {}

   private logger = new Logger('AuthService')

   async authenticateUser(authCredentialsDto: AuthCredentialsDto): Promise<AuthResponseDto> {
      const payload: JwtPayload = await this.userRepository.validateUserPassword(authCredentialsDto);
      this.logger.debug(JSON.stringify(payload))
      if (!payload) {
         throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtService.sign(payload);

      return { token }
   }

}
