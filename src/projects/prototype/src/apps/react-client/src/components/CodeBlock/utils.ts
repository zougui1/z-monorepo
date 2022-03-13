export const getRowKey = (row: any): any => {
  return row.children?.[0]?.properties?.key ?? row.properties?.key ?? row.value;
}
