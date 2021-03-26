import { Body, Controller, Get, HttpCode, Logger, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import CreateUserDto from './dto/create-user.dto';
import User from './entities/user.entity';
import { Role } from './enums/roles.enum';
import { UsersService } from './users.service';
import SetUserRoleDto from "./dto/set-user-role.dto";

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
   
   constructor(
      private usersService: UsersService,
   ) {}

   private logger = new Logger('UsersController');

   @Post()
   @Roles(Role.APPLICATION_ADMIN, Role.COMPANY_ADMIN)
   createUser(@Body(ValidationPipe) createUserDto: CreateUserDto, @GetUser() issuer: User) {
      return this.usersService.createUser(createUserDto, issuer);
   }

   @Get()
   @Roles(Role.APPLICATION_ADMIN, Role.COMPANY_ADMIN)
   async listUsers(@GetUser() issuer, @Query('companyId') companyId?: number): Promise<User[]> {
      this.logger.debug(`Handling GET /users?companyId=${companyId} Issuer: ${JSON.stringify(issuer)}`)
      return await this.usersService.listUsers(issuer, companyId);
   }

   @Patch(":userId/activate") 
   @Roles(Role.APPLICATION_ADMIN, Role.COMPANY_ADMIN)
   @HttpCode(200)
   activateUser(@Param('userId', ParseIntPipe) userId: number, @GetUser() issuer: User) {
      return this.usersService.activateUser(userId, issuer);
   }

   @Patch(":userId/deactivate") 
   @Roles(Role.APPLICATION_ADMIN, Role.COMPANY_ADMIN)
   @HttpCode(200)
   deactivateUser(@Param('userId', ParseIntPipe) userId: number, @GetUser() issuer: User) {
      return this.usersService.deactivateUser(userId, issuer);
   }

   @Patch(':userId/role')
   @Roles(Role.APPLICATION_ADMIN, Role.COMPANY_ADMIN)
   @HttpCode(200)
   setUserRole(@Param('userId', ParseIntPipe) userId: number, @Body(ValidationPipe) role: SetUserRoleDto, @GetUser() issuer: User) {
      this.logger.debug(`Handling PATCH /users/${userId}/role Issuer: ${JSON.stringify(issuer)}`)
      return this.usersService.setUserRole(userId, role, issuer);
   }

}
