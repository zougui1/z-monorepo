export class Store<T extends Record<string, any> = Record<string, any>> {
  private id: number = 0;
  private listeners: Record<string, () => void> = {};
  private state: T;
  private reducer: (state: T, action: any) => T;
  sizeElement: HTMLDivElement | null | undefined;

  constructor(reducer: (state: T, action: any) => T, initialState: T) {
    this.state = initialState;
    this.reducer = reducer;
  }

  getState = (): T => {
    return this.state;
  }

  dispatch = (action: any): void => {
    const previousState = this.state;
    console.time('elapsed time');

    this.state = this.reducer(this.state, action);

    for (const listener of Object.values(this.listeners)) {
      listener();
    }

    console.groupCollapsed(action.type);
    console.log('action:', action);
    console.log('previous state:', previousState);
    console.log('next state:', this.state);
    console.log('element', this.sizeElement);
    console.timeEnd('elapsed time');
    console.groupEnd();
  }

  subscribe = (listener: (() => void)): (() => void) => {
    const id = this.id++;
    this.listeners[id] = listener;

    return () => {
      delete this.listeners[id];
    }
  }
}
