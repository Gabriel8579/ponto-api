import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength, Validate } from "class-validator";
import CnpjValidator from "src/companies/validators/cnpj.validator";
import { Role } from "../enums/roles.enum";

export default class CreateUserDto {

   @IsString()
   @MinLength(4)
   name: string;

   @IsString()
   @MinLength(4)
   @MaxLength(20)
   username: string;

   @IsString()
   @MinLength(8)
   @MaxLength(20)
   @Matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
      { message: "password too weak"}
   )
   password: string;

   @IsOptional()
   @IsEnum(Role)
   roles?: Role;

   @IsOptional()
   @Validate(CnpjValidator)
   companyCnpj?: string;

}