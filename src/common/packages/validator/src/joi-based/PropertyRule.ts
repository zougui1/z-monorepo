import { schemaCache } from './schemaCache';
import type { Rule } from './Rule';

export const PropertyRule = (defineRule: ((rule: Rule) => void)) => {
  return function PropertyRuleDecorator(target: object, propertyKey: string) {
    defineRule(schemaCache.get(target.constructor).getRule(propertyKey));
  }
}
