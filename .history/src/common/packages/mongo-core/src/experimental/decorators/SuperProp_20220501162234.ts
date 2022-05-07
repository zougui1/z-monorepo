import { Prop } from '../../decorators';

const primitives = [String, Number, Boolean];

export const SuperProp = (): PropertyDecorator => {
  return function SuperPropDecorator(target, propName: string | symbol) {
    const basicType = Reflect.getMetadata('design:type', target, propName);
    const isPrimitiveType = primitives.includes(basicType);
    const properties = Reflect.getMetadata('custom-properties', target.constructor) || [];
    const newProps = [
      ...properties,
      {
        target,
        propName,
        isPrimitiveType,
        basicType,
      },
    ];
    Reflect.metadata('custom-properties', newProps)(target.constructor);

    if (isPrimitiveType) {
      Prop()(target, propName);
    } else {
      Prop({ type: String })(target, propName);
    }
  }
}
