import categoryData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoryData];
  }

  async getAll() {
    await delay(200);
    return [...this.categories];
  }

  async getById(id) {
    await delay(200);
    const category = this.categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  }

  async create(categoryData) {
    await delay(250);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updateData) {
    await delay(200);
    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updateData
    };
    
    return { ...this.categories[categoryIndex] };
  }

  async delete(id) {
    await delay(200);
    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    this.categories.splice(categoryIndex, 1);
    return true;
  }
}

export default new CategoryService();