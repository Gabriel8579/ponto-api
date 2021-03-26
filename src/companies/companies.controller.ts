import {
   Body,
   Controller,
   Get,
   HttpCode,
   Logger,
   Param,
   ParseIntPipe,
   Patch,
   Post,
   UseGuards,
   ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import User from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { CompaniesService } from './companies.service';
import CreateCompanyDto from './dto/create-company.dto';
import Company from './entities/company.entity';

@Controller('companies')
@UseGuards(AuthGuard(), RolesGuard)
export class CompaniesController {
   constructor(private companiesService: CompaniesService) {}

   private logger = new Logger('CompaniesController');

   @Post()
   @Roles(Role.APPLICATION_ADMIN)
   createCompany(@Body(ValidationPipe) createCompanyDto: CreateCompanyDto) {
      this.logger.debug(
         `Handling requisition POST /companies DTO: ${JSON.stringify(
            createCompanyDto,
         )}`,
      );
      this.companiesService.createCompany(createCompanyDto);
   }

   @Get()
   @Roles(Role.APPLICATION_ADMIN, Role.COMPANY_ADMIN)
   async listCompanies(@GetUser() issuer: User): Promise<Company[]> {
      return await this.companiesService.listCompanies(issuer);
   }

   @Patch(':companyId/activate')
   @Roles(Role.APPLICATION_ADMIN)
   @HttpCode(200)
   activateCompany(@Param('companyId', ParseIntPipe) companyId: number) {
      this.logger.debug(
         `Handling requisition PATCH /companies/${companyId}/activate`,
      );
      this.companiesService.activateCompany(companyId);
   }

   @Patch(':companyId/deactivate')
   @Roles(Role.APPLICATION_ADMIN)
   @HttpCode(200)
   deactivateCompany(@Param('companyId', ParseIntPipe) companyId: number) {
      this.logger.debug(
         `Handling requisition PATCH /companies/${companyId}/activate`,
      );
      this.companiesService.deactivateCompany(companyId);
   }
}
