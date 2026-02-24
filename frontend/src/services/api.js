const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Job Orders endpoints
  async getJobOrder(id) {
    return this.request(`/joborders/${id}`);
  }

  async getJobOrdersByCraftsman(craftsmanId) {
    return this.request(`/joborders/craftsman/${craftsmanId}`);
  }

  async createJobOrder(jobOrder) {
    return this.request('/joborders', {
      method: 'POST',
      body: JSON.stringify(jobOrder),
    });
  }

  async updateJobOrder(id, jobOrder) {
    return this.request(`/joborders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobOrder),
    });
  }

  async deleteJobOrder(id) {
    return this.request(`/joborders/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();