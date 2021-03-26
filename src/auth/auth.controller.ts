import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {

   constructor(
      private authService: AuthService,
   ) {}

   @Post()
   authenticateUser(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<AuthResponseDto> {
      return this.authService.authenticateUser(authCredentialsDto);
   }

}
