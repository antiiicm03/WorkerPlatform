const API_BASE_URL = 'http://localhost:5114/api';

class ApiService {
  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      let data;
      try {
      data = await response.json();
      } catch {
      data = { message: 'Invalid JSON response' };
      }

      console.log('API Response:', { 
      status: response.status, 
      url, 
      data 
      });

      if (!response.ok) {
      const errorMsg = data.message || data.error || JSON.stringify(data);
      throw new Error(errorMsg);
    }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password, userType) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
    });
  }

  async registerUser(userData) {
    return this.request('/auth/register/user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async registerCraftsman(craftsmanData) {
    return this.request('/auth/register/craftsman', {
      method: 'POST',
      body: JSON.stringify(craftsmanData),
    });
  }

  // Craftsman endpoints
  async getCraftsmanProfile(id) {
    return this.request(`/craftsmen/${id}`);
  }

  async updateCraftsman(id, craftsmanData) {
    return this.request(`/craftsmen/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...craftsmanData,
        craftsmanId: id
      }),
    });
  }

  // Job Orders endpoints
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