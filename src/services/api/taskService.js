import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async create(taskData) {
    await delay(250);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await delay(200);
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateData
    };
    
    return { ...this.tasks[taskIndex] };
  }

  async delete(id) {
    await delay(200);
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(taskIndex, 1);
    return true;
  }
}

export default new TaskService();