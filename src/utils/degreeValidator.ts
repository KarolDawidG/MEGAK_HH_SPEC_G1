import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function IsDegreeValid(
  property: { min: number; max: number },
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isDegreeValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: number, args: ValidationArguments) {
          const { min, max } = args.constraints[0];
          return typeof value === 'number' && value >= min && value <= max;
        },
      },
    });
  };
}
