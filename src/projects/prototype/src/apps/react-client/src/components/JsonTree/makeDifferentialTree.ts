import { diff } from 'deep-object-diff';

import { getType, Types, isIterableType } from './getType';

export const makeDifferentialTree = ({ oldValue, newValue, label }: MakeDifferentialTreeOptions) => {
  const differenceValue = diff(oldValue, newValue);

  try {
    return createNode({
      label,
      oldValue,
      newValue,
      differenceValue,
    });
  } catch (error) {
    console.log({
      oldValue,
      newValue,
      differenceValue,
      label,
    })
    throw error;
  }
}

const createNode = ({ oldValue, newValue, differenceValue, label }: CreateNodeOptions) => {
  const oldType = getType(oldValue);
  const newType = getType(newValue);
  const differenceType = getType(differenceValue);

  const hasChildren = (isIterableType(oldType) || isIterableType(newType)) && isIterableType(differenceType);
  const isCompletelyDifferent = isIterableType(oldType) && isIterableType(newType) && isIterableType(differenceType);

  const basicNode = {
    label,
    oldType,
    oldValue,
    newType,
    newValue,
    differenceValue,
    differenceType,
    isCompletelyDifferent,
  };

  return {
    ...basicNode,
    children: hasChildren ? createChildren(basicNode) : undefined,
  };
}

const createChildren = (node: BasicNode): any[] | undefined => {
  const oldSubEntries = toSubEntries(node.oldValue, node.oldType);
  const newSubEntries = toSubEntries(node.newValue, node.newType);
  const differenceSubEntries = toSubEntries(node.differenceValue, node.differenceType);

  const subEntriesByLength = {
    [oldSubEntries?.length || '']: oldSubEntries,
    [newSubEntries?.length || '']: newSubEntries,
    [differenceSubEntries?.length || '']: differenceSubEntries,
  };

  const maxLength = Math.max(oldSubEntries?.length || 0, newSubEntries?.length || 0, differenceSubEntries?.length || 0);
  const findSubEntryByLabel = (subEntries: any[] | undefined, label: string | undefined) => {
    return subEntries?.find(e => e?.label === label);
  }

  const subEntries = subEntriesByLength[maxLength]?.map(({ label }, index) => createNode({
    label: label as string,
    oldValue: findSubEntryByLabel(oldSubEntries, label as string)?.value,
    newValue: findSubEntryByLabel(newSubEntries, label as string)?.value,
    differenceValue: findSubEntryByLabel(differenceSubEntries, label as string)?.value,
  }));

  return subEntries;
}

const toSubEntries = (value: any, type: Types) => {
  switch (type) {
    case 'array':
      return (value as any[]).map((value, index) => ({ value, label: index }));
    case 'iterable':
      return Array.from(value, (value, index) => ({ value, label: index }));
    case 'object':
      return Object.entries(value).map(([label, value]) => ({ value, label }));
  }
}

export interface MakeDifferentialTreeOptions {
  oldValue: any;
  newValue: any;
  label?: string | undefined;
}

interface CreateNodeOptions {
  oldValue: any;
  newValue: any;
  differenceValue: any;
  label?: string | undefined;
}

interface BasicNode {
  oldValue: any;
  oldType: Types;
  newValue: any;
  newType: Types;
  differenceValue: any;
  differenceType: Types;
}
