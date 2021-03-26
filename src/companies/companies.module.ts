import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import CompanyRepository from './repositories/company.repository';

@Module({
   providers: [CompaniesService],
   controllers: [CompaniesController],
   imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      TypeOrmModule.forFeature([
         CompanyRepository,
      ]),
      AuthModule,
      UsersModule,
   ],
})
export class CompaniesModule {}
