import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
  }

  async getAll() {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "category" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "completed" } },
          { "Field": { "Name": "completed_at" } },
          { "Field": { "Name": "created_at" } },
          { "Field": { "Name": "CreatedOn" } },
          { "Field": { "Name": "CreatedBy" } },
          { "Field": { "Name": "ModifiedOn" } },
          { "Field": { "Name": "ModifiedBy" } }
        ],
        "orderBy": [
          {
            "FieldName": "CreatedOn",
            "SortType": "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const tasks = (response.data || []).map(task => ({
        id: task.Id,
        title: task.Name,
        description: task.description,
        category: task.category,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        completedAt: task.completed_at,
        createdAt: task.created_at || task.CreatedOn
      }));

      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ["Id", "Name", "description", "category", "priority", "due_date", "completed", "completed_at", "created_at"]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Task not found');
      }

      // Transform database fields to match UI expectations
      const task = {
        id: response.data.Id,
        title: response.data.Name,
        description: response.data.description,
        category: response.data.category,
        priority: response.data.priority,
        dueDate: response.data.due_date,
        completed: response.data.completed,
        completedAt: response.data.completed_at,
        createdAt: response.data.created_at
      };

      return task;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: taskData.title,
          description: taskData.description || "",
          category: taskData.category,
          priority: taskData.priority,
          due_date: taskData.dueDate,
          completed: false,
          completed_at: null,
          created_at: new Date().toISOString()
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
          const newTask = successfulRecords[0].data;
          // Transform back to UI format
          return {
            id: newTask.Id,
            title: newTask.Name,
            description: newTask.description,
            category: newTask.category,
            priority: newTask.priority,
            dueDate: newTask.due_date,
            completed: newTask.completed,
            completedAt: newTask.completed_at,
            createdAt: newTask.created_at
          };
        }
      }

      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      // Only include Updateable fields for update
      const updateRecord = { Id: parseInt(id) };
      
      if (updateData.title !== undefined) updateRecord.Name = updateData.title;
      if (updateData.description !== undefined) updateRecord.description = updateData.description;
      if (updateData.category !== undefined) updateRecord.category = updateData.category;
      if (updateData.priority !== undefined) updateRecord.priority = updateData.priority;
      if (updateData.dueDate !== undefined) updateRecord.due_date = updateData.dueDate;
      if (updateData.completed !== undefined) updateRecord.completed = updateData.completed;
      if (updateData.completedAt !== undefined) updateRecord.completed_at = updateData.completedAt;

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
          const updatedTask = successfulUpdates[0].data;
          // Transform back to UI format
          return {
            id: updatedTask.Id,
            title: updatedTask.Name,
            description: updatedTask.description,
            category: updatedTask.category,
            priority: updatedTask.priority,
            dueDate: updatedTask.due_date,
            completed: updatedTask.completed,
            completedAt: updatedTask.completed_at,
            createdAt: updatedTask.created_at
          };
        }
      }

      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
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

      throw new Error('Failed to delete task');
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export default new TaskService();