import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Cnpj } from "./cnpj-validator";

@ValidatorConstraint()
export default class CnpjValidator implements ValidatorConstraintInterface {
   
   validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
      let valor: string = value;
      if (!valor) { return false }
      valor = valor.split('.').join('').replace('/','').replace('-','').trim()
      let validador: Cnpj = new Cnpj();
      
      return validador.validate(value);
   }

   defaultMessage?(validationArguments?: ValidationArguments): string {
      return 'CNPJ is invalid'
   }
   
}