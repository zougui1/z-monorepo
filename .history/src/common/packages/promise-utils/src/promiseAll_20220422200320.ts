export const promiseAll = <T extends Record<string, Promise<any>>>(promises: T) => {

}

export type ResolvedAllFromObject<T extends Record<string, Promise<any>>> = {
  [Key in keyof T]: Awaited<T[Key]>
}
