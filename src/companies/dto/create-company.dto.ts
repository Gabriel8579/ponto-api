import { IsNotEmpty, IsString, Validate } from "class-validator";
import CnpjValidator from "../validators/cnpj.validator";

export default class CreateCompanyDto {
   
   @IsNotEmpty()
   @IsString()
   name: string;

   @IsNotEmpty()
   @IsString()
   @Validate(CnpjValidator)
   cnpj: string;

}