import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import User from "src/users/entities/user.entity";
import { Role } from "src/users/enums/roles.enum";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

   constructor(
      private reflector: Reflector
   ) {}

   private logger = new Logger('RolesGuard')

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const required_roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
         context.getHandler(),
         context.getClass(),
      ]);
      
      if (!required_roles) {
         return true;
      }

      const user: User = context.switchToHttp().getRequest().user;

      this.logger.debug(`Checking user for required_roles: ${JSON.stringify(required_roles)} User Roles: ${JSON.stringify(user.roles)}`)

      return required_roles.some(role => user.roles === role);
   }
   
}