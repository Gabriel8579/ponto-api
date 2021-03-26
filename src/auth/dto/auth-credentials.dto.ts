import { IsOptional, IsString, Matches, MaxLength, MinLength, Validate } from "class-validator";
import CnpjValidator from "src/companies/validators/cnpj.validator";

export class AuthCredentialsDto {
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
   @IsString()
   @Validate(CnpjValidator)
   company?: string;
}