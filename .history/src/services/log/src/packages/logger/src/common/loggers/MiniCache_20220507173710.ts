export class MiniCache {
  values: string[] = [];
  maxLength: number = 100;

  addValue = (value: string) => {
    if (this.values.length >= this.maxLength) {
      this.values.shift();
    }

    this.values.push(value);
  }
}
