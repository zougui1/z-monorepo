export class Store<T extends Record<string, any> = Record<string, any>> {
  private id: number = 0;
  private listeners: Record<string, () => void> = {};
  private state: T;
  private reducer: (state: T, action: any) => T;

  constructor(reducer: (state: T, action: any) => T, initialState: T) {
    this.state = initialState;
    this.reducer = reducer;
  }

  getState = (): T => {
    return this.state;
  }

  dispatch = (action: any): void => {
    this.state = this.reducer(this.state, action);

    for (const listener of Object.values(this.listeners)) {
      listener();
    }
  }

  subscribe = (listener: (() => void)): (() => void) => {
    const id = this.id++;
    this.listeners[id] = listener;

    return () => {
      delete this.listeners[id];
    }
  }
}
