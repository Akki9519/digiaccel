const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Common request wrapper with JSON headers and error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Fetch tasks grouped by week with open/completed counters
  getWeeklyTasks: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/tasks/weekly${query}`);
  },

  // Fetch all tasks with optional search or filters
  getTasks: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request(`/tasks${queryString}`);
  },

  // Get single task by ID
  getTaskById: (id) => request(`/tasks/${id}`),

  // Create new task
  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  // Update existing task
  updateTask: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),

  // Toggle or update status
  updateTaskStatus: (id, status) =>
    request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Delete task
  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};
