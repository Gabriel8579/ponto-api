import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { SelectQueryBuilder } from 'typeorm';
import CreateCompanyDto from './dto/create-company.dto';
import Company from './entities/company.entity';
import CompanyRepository from './repositories/company.repository';

@Injectable()
export class CompaniesService {

   constructor(
      @InjectRepository(CompanyRepository)
      private companyRepository: CompanyRepository
   ) {}

   private logger = new Logger('CompaniesService');

   async createCompany(createCompanyDto: CreateCompanyDto): Promise<void> {
      return this.companyRepository.createCompany(createCompanyDto);
   }

   async listCompanies(issuer: User): Promise<Company[]> {
      const qb: SelectQueryBuilder<Company> = this.companyRepository.createQueryBuilder('company')

      if (issuer.roles === Role.COMPANY_ADMIN) {
         qb.where('company.id = :companyId', { companyId: issuer.company?.id })
      }

      return await qb.getMany()
   }

   async activateCompany(companyId: number): Promise<void> {
      const company = await this.findCompanyById(companyId);

      if (company.active) {
         throw new BadRequestException("This company is already activated!");
      }

      company.active = true;

      try {
         company.save()
      } catch (error) {
         this.logger.error(error)
         throw new InternalServerErrorException(error)
      }
   }

   async deactivateCompany(companyId: number): Promise<void> {
      const company = await this.findCompanyById(companyId);

      if (!company.active) {
         throw new BadRequestException("This company is already deactivated!");
      }

      company.active = false;

      try {
         company.save()
      } catch (error) {
         this.logger.error(error)
         throw new InternalServerErrorException(error)
      }
   }

   async findCompanyById(companyId: number): Promise<Company> {
      const company: Company = await this.companyRepository.findOne(companyId);

      if (!company) {
         throw new NotFoundException("Company not found!");
      }

      return company;
   }

   async findCompanyByCnpj(cnpj: string): Promise<Company> {
      return this.companyRepository.findOne({ cnpj });
   }

}
