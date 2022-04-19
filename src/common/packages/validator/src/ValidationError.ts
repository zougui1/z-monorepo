import { ValidationError as _ValidationError } from 'class-validator';

export class ValidationError {
  property: _ValidationError['property'];
  value: _ValidationError['value'];
  target: _ValidationError['target'];
  constraints: Constraint[];
  contexts: _ValidationError['contexts'];
  children: ValidationError[] | undefined;

  constructor(error: _ValidationError) {
    this.property = error.property;
    this.value = error.value;
    this.target = error.target;
    this.contexts = error.contexts;
    this.constraints = parseJsonConstraints(error.constraints);
    this.children = error.children?.map(child => new ValidationError(child));
  }
}

const parseJsonConstraints = (constraints: _ValidationError['constraints'] = {}): Constraint[] => {
  return Object.values(constraints).map(value => JSON.parse(value));
}

export interface Constraint {
  key: string;
  data: Record<string, any>;
}
