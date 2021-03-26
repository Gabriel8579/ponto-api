import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import User from '../entities/user.entity';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import CreateUserDto from '../dto/create-user.dto';
import Company from 'src/companies/entities/company.entity';
import CompanyRepository from 'src/companies/repositories/company.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../enums/roles.enum';
import {
   ConflictException,
   InternalServerErrorException,
   Logger,
   NotFoundException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
   private bcrypt = require('bcryptjs');
   private logger = new Logger('UserRepository');

   async createUser(
      createUserDto: CreateUserDto,
      company?: Company,
   ): Promise<void> {
      const user = new User();

      user.name = createUserDto.name;
      user.username = createUserDto.username;
      user.password = await this.hashPassword(createUserDto.password);
      user.company = company;
      user.roles = createUserDto.roles ?? Role.USER;
      user.active = true;

      try {
         await user.save();
      } catch (error) {
         if (error.code === '23505') {
            throw new ConflictException('This username already exists!');
         }
         Logger.error(
            `Error when creating a new user DTO: ${JSON.stringify(
               createUserDto,
            )}`,
         );
         throw new InternalServerErrorException(error);
      }
   }

   async listUsers(companyId?: number): Promise<User[]> {
      const qb = this.createQueryBuilder('user');

      if (companyId) {
         qb.innerJoin(
            'user.company',
            'company',
         ).where('company.id = :companyId', { companyId });
         this.logger.debug(qb.getQueryAndParameters());
      }

      return await qb.getMany();
   }

   async validateUserPassword(
      authCredentialsDto: AuthCredentialsDto,
   ): Promise<JwtPayload> {
      const { username, password } = authCredentialsDto;
      const qb = this.createQueryBuilder('user')
         .leftJoinAndSelect('user.company', 'company')
         .addSelect('user.password')
         .where('user.username = :username', { username });

      const user = await qb.getOne();

      if (user && (await this.validatePassword(password, user.password))) {
         const retorno = {
            username: user.username,
            company: user.company?.cnpj,
            roles: user.roles,
         };
         this.logger.debug(JSON.stringify(user));
         this.logger.debug(JSON.stringify(retorno));
         return retorno;
      }
      this.logger.debug(
         `Failed to fetch user: ${JSON.stringify(user)} SQL: ${qb.getSql()}`,
      );
      return null;
   }

   private async hashPassword(password: string): Promise<string> {
      return this.bcrypt.hash(password, 10);
   }

   private async validatePassword(
      text: string,
      hash: string,
   ): Promise<boolean> {
      return this.bcrypt.compare(text, hash);
   }
}
