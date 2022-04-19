import { ValidationArguments } from 'class-validator';

function toJson(key: string, args: ValidationArguments, data?: any): string {
  return JSON.stringify({key, field: args.property, data});
}

export function i18Msg(key: string, data?: Record<string, any>) {
  return (args: ValidationArguments) => toJson(key, args, data);
}
