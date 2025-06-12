import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category';
  }

  async getAll() {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "color" } },
          { "Field": { "Name": "icon" } },
          { "Field": { "Name": "CreatedOn" } },
          { "Field": { "Name": "CreatedBy" } },
          { "Field": { "Name": "ModifiedOn" } },
          { "Field": { "Name": "ModifiedBy" } }
        ],
        "orderBy": [
          {
            "FieldName": "Name",
            "SortType": "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const categories = (response.data || []).map(category => ({
        id: category.Id,
        name: category.Name,
        color: category.color,
        icon: category.icon
      }));

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ["Id", "Name", "color", "icon"]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Category not found');
      }

      // Transform database fields to match UI expectations
      const category = {
        id: response.data.Id,
        name: response.data.Name,
        color: response.data.color,
        icon: response.data.icon
      };

      return category;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  async create(categoryData) {
    try {
      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: categoryData.name,
          color: categoryData.color || "#6B7280",
          icon: categoryData.icon || "Folder"
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const newCategory = successfulRecords[0].data;
          // Transform back to UI format
          return {
            id: newCategory.Id,
            name: newCategory.Name,
            color: newCategory.color,
            icon: newCategory.icon
          };
        }
      }

      throw new Error('Failed to create category');
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      // Only include Updateable fields for update
      const updateRecord = { Id: parseInt(id) };
      
      if (updateData.name !== undefined) updateRecord.Name = updateData.name;
      if (updateData.color !== undefined) updateRecord.color = updateData.color;
      if (updateData.icon !== undefined) updateRecord.icon = updateData.icon;

      const params = {
        records: [updateRecord]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedCategory = successfulUpdates[0].data;
          // Transform back to UI format
          return {
            id: updatedCategory.Id,
            name: updatedCategory.Name,
            color: updatedCategory.color,
            icon: updatedCategory.icon
          };
        }
      }

      throw new Error('Failed to update category');
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      throw new Error('Failed to delete category');
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}

export default new CategoryService();