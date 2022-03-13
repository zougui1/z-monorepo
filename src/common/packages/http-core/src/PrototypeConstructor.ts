import * as yup from 'yup';

const buildSchemaFromRouteTemplate = (url: string) => {
  // removes empty strings which happens due to a trailing a slash
  const pathComponents = url.split('/').filter(Boolean);
  const yupComponents = pathComponents
    .filter(pathComponent => pathComponent.startsWith(':'))
    .map(pathComponent => {
      const isOptional = pathComponent.endsWith('?');
      const propertyName = pathComponent.slice(1, -1);

      return { name: propertyName, isOptional };
    });

  const yupShape = yupComponents.reduce((shape, component) => {
    let schema = yup.mixed();
    schema = component.isOptional
      ? schema.optional()
      : schema.required();

    shape[component.name] = component.isOptional
      ? schema.optional()
      : schema.required();

    return shape;
  }, {} as Record<string, any>);
}

yup.object()
