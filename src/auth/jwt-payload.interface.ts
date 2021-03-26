import { Role } from "src/users/enums/roles.enum";

export interface JwtPayload {
   username: string;
   company: string;
   roles: Role;
}