// ApiService.js
import ApiClient from './ApiClient';

class ApiService {
  static async createProject(name, description) {
    return ApiClient.post('/project', { name, description });
  }

  static async getUserproject() {
    return ApiClient.get('/project');
  }

  static async getProject(id) {
    return ApiClient.get(`/project/${id}`);
  }

  static async updateProject(id, name, description) {
    return ApiClient.put(`/project/${id}`, { name, description });
  }

  static async deleteProject(id) {
    return ApiClient.delete(`/project/${id}`);
  }

  // API Key related methods
  static async createApiKey(projectId, name) {
    return ApiClient.post(`/apikey/${projectId}`, { name });
  }

  static async getProjectApiKeys(projectId) {
    return ApiClient.get(`/apikey/${projectId}`);
  }

  static async updateApiKey(id, name, isActive) {
    return ApiClient.put(`/apikey/${id}`, { name, isActive });
  }

  static async deleteApiKey(id) {
    return ApiClient.delete(`/apikey/${id}`);
  }
  static async getMessages(projectId){
    return ApiClient.get(`/message/project/${projectId}`);
  }
  static async deleteMessageByid(messageId){
    return ApiClient.delete(`/message/${messageId}`);
  }
  static async deleteMessages(projectId){
    return ApiClient.delete(`/message/project/${projectId}/all`)
  }
}

export default ApiService;