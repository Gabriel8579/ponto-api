import {
   BadRequestException,
   Injectable,
   InternalServerErrorException,
   Logger,
   NotFoundException,
   UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import Company from 'src/companies/entities/company.entity';
import CompanyRepository from 'src/companies/repositories/company.repository';
import CreateUserDto from './dto/create-user.dto';
import SetUserRoleDto from './dto/set-user-role.dto';
import User from './entities/user.entity';
import { Role } from './enums/roles.enum';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
   constructor(
      @InjectRepository(UserRepository)
      private userRepository: UserRepository,
      @InjectRepository(CompanyRepository)
      private companyRepository: CompanyRepository,
   ) {}

   private logger = new Logger('UsersService');

   async createUser(createUserDto: CreateUserDto, issuer: User): Promise<void> {
      if (
         createUserDto.companyCnpj &&
         issuer.roles === Role.COMPANY_ADMIN &&
         issuer.company.cnpj !== createUserDto.companyCnpj
      ) {
         throw new UnauthorizedException(
            'You cannot create a user for a company that is not the same as yours!',
         );
      }
      if (
         createUserDto.roles === Role.APPLICATION_ADMIN &&
         issuer.roles !== Role.APPLICATION_ADMIN
      ) {
         throw new UnauthorizedException(
            'You cannot create users with this permission!',
         );
      }
      if (
         createUserDto.roles === Role.COMPANY_ADMIN &&
         !createUserDto.companyCnpj
      ) {
         throw new BadRequestException(
            "For COMPANY_ADMIN, you must provide 'companyCnpj' field!",
         );
      }

      let company: Company;
      if(createUserDto.companyCnpj) {
         company = await this.companyRepository.findOne({ cnpj: createUserDto.companyCnpj })
         if (!company) {
            throw new NotFoundException('Company not found!')
         }
      }

      return this.userRepository.createUser(createUserDto, company);
   }

   async listUsers(issuer: User, companyId?: number): Promise<User[]> {
      if (issuer.roles === Role.COMPANY_ADMIN) {
         companyId = issuer.company.id;
      }

      return await this.userRepository.listUsers(companyId);
   }

   async deactivateUser(userId: number, issuer: User): Promise<void> {
      const user = await this.findUserById(userId);

      if (
         user.roles === Role.APPLICATION_ADMIN &&
         issuer.roles !== user.roles
      ) {
         throw new UnauthorizedException(
            'You cannot deactivate users with this permission!',
         );
      }

      if (
         issuer.roles === Role.COMPANY_ADMIN &&
         user.company.id !== issuer.company.id
      ) {
         throw new UnauthorizedException(
            'You cannot deactivate users with this permission!',
         );
      }

      if (!user.active) {
         throw new BadRequestException('This user is already deactivated!');
      }

      user.active = false;

      try {
         await user.save();
      } catch (error) {
         this.logger.error(error);
         throw new InternalServerErrorException(error);
      }
   }

   async activateUser(userId: number, issuer: User): Promise<void> {
      const user = await this.findUserById(userId);

      if (
         user.roles === Role.APPLICATION_ADMIN &&
         issuer.roles !== user.roles
      ) {
         throw new UnauthorizedException(
            'You cannot activate users with this permission!',
         );
      }

      if (
         issuer.roles === Role.COMPANY_ADMIN &&
         user.company.id !== issuer.company.id
      ) {
         throw new UnauthorizedException(
            'You cannot activate users with this permission!',
         );
      }

      if (user.active) {
         throw new BadRequestException('This user is already activated!');
      }

      user.active = true;

      try {
         await user.save();
      } catch (error) {
         this.logger.error(error);
         throw new InternalServerErrorException(error);
      }
   }

   async setUserRole(userId: number, roleDto: SetUserRoleDto, issuer: User) {
      const user = await this.findUserById(userId);
      const role = roleDto.role;

      if (
         user.roles === Role.APPLICATION_ADMIN &&
         issuer.roles !== user.roles
      ) {
         throw new UnauthorizedException('You cannot set this role!');
      }

      if (role === Role.APPLICATION_ADMIN && issuer.roles !== role) {
         throw new UnauthorizedException('You cannot set this role!');
      }

      if (
         issuer.roles === Role.COMPANY_ADMIN &&
         user.company.id !== issuer.company.id
      ) {
         throw new UnauthorizedException('You cannot set this role!');
      }

      if (role === user.roles) {
         throw new BadRequestException('This user already have this role!');
      }

      user.roles = role;

      try {
         await user.save();
      } catch (error) {
         this.logger.error(error);
      }
   }

   async findUserById(userId: number): Promise<User> {
      const user = this.userRepository.findOne(userId);

      if (!user) {
         throw new NotFoundException('User not found!');
      }

      return user;
   }

   async validateUserPassword(
      authCredentialsDto: AuthCredentialsDto,
   ): Promise<JwtPayload> {
      return this.userRepository.validateUserPassword(authCredentialsDto);
   }
}
