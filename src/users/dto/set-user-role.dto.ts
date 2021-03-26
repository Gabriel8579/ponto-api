import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "../enums/roles.enum";

export default class SetUserRoleDto {

   @IsString()
   @IsEnum(Role)
   @IsNotEmpty()
   role: Role;

}