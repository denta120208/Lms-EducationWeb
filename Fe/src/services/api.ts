// API Configuration
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith('/api/admin')) {
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
        return config;
      }
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  student: {
    id: number;
    name: string;
    email: string;
  };
  message: string;
}

export interface TeacherLoginResponse {
  token: string;
  teacher: {
    id: number;
    name: string;
    email: string;
    subject: string;
  };
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: { id: number; username: string; email: string };
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  setToken: (token: string, _isTeacher = false): void => {
    localStorage.setItem('token', token);
    // Set token in axios defaults
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  removeToken: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('teacher_data');
    // Remove token from axios defaults
    delete api.defaults.headers.common['Authorization'];
  },
  
  isAuthenticated: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return false;
    
    try {
      // Simple JWT expiry check (decode payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },

  isTeacher: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'teacher';
    } catch {
      return false;
    }
  }
};

// User data management
export const userManager = {
  getUser: () => {
    const userData = localStorage.getItem('user_data');
    if (userData) return JSON.parse(userData);
    
    const teacherData = localStorage.getItem('teacher_data');
    if (teacherData) return JSON.parse(teacherData);
    
    return null;
  },
  
  setUser: (user: any, isTeacher = false) => {
    if (isTeacher) {
      localStorage.setItem('teacher_data', JSON.stringify(user));
    } else {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  },
  
  removeUser: () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('teacher_data');
  }
};

// API Helper function
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth token if available
  const token = tokenManager.getToken();
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw {
        message: errorText || 'Network error',
        status: response.status,
      } as ApiError;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    if (error instanceof TypeError) {
      throw {
        message: 'Network error - please check your connection',
        status: 0,
      } as ApiError;
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      // Store token and user data
      tokenManager.setToken(response.data.token);
      userManager.setUser(response.data.student);
      
      // Set token in axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to login';
    }
  },
  adminLogin: async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const res = await api.post('/api/admin/login', credentials);
    return res.data;
  },
  
  teacherLogin: async (credentials: LoginRequest): Promise<TeacherLoginResponse> => {
    try {
      const response = await api.post('/api/auth/teacher/login', credentials);
      
      // Store token and user data
      tokenManager.setToken(response.data.token, true);
      userManager.setUser(response.data.teacher, true);
      
      // Set token in axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to login';
    }
  },
  
  register: async (userData: RegisterRequest): Promise<{ message: string }> => {
    return await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  logout: () => {
    tokenManager.removeToken();
    userManager.removeUser();
  },
  
  getProfile: async () => {
    return await apiCall('/api/profile');
  },
  
  getDashboard: async () => {
    return await apiCall('/api/dashboard');
  }
};

// Health check
export const healthCheck = async () => {
  return await apiCall('/api/health');
};