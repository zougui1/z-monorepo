const taskIdColors = [
  '#a5f454',
  '#d174a6',
  '#88d',
  '#98B9AB',
  '#DB2955',
  '#937666',
  '#E6AF2E',
  '#2274A5',
  '#632B30',
  '#FF00A6',
];

export class TaskColorPicker {
  #iterations: number = 0;
  colors: Record<string, string> = {};
  maxLength: number = 100;

  add = (taskId: string) => {
    if (Object.keys(this.colors).length >= this.maxLength) {
      this.remove(taskId);
    }

    this.colors[taskId] = taskIdColors[this.#iterations++ % taskIdColors.length];
  }

  remove = (taskId: string) => {
    delete this.colors[taskId];
  }

  getColor = (taskId: string): string => {
    if (this.colors[taskId]) {
      const color = this.colors[taskId];
      this.remove(taskId);
      return color;
    }

    this.add(taskId);
    const color = this.colors[taskId];

    return color;
  }
}
