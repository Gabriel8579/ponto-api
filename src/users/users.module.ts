import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import CompanyRepository from 'src/companies/repositories/company.repository';
import { UserRepository } from './repositories/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
   providers: [UsersService],
   controllers: [UsersController],
   imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      TypeOrmModule.forFeature([
         UserRepository,
         CompanyRepository
      ])
   ]
})
export class UsersModule {}
