import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import CreateCompanyDto from "../dto/create-company.dto";
import Company from "../entities/company.entity";

@EntityRepository(Company)
export default class CompanyRepository extends Repository<Company> {

   async createCompany(createCompanyDto: CreateCompanyDto) {
      const company = new Company();
      const { cnpj, name } = createCompanyDto;

      company.cnpj = cnpj;
      company.name = name;
      company.active = true;

      try {
         await company.save()
      } catch (error) {
         if (error.code === '23505') {
            throw new ConflictException(`This company already exists`)
         }
         Logger.error(`Error when creating company! DTO: ${JSON.stringify(createCompanyDto)}`)
         throw new InternalServerErrorException(error)
      }

   }

}