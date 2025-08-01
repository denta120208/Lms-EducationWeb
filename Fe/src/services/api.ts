// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

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

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
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
  }
};

// User data management
export const userManager = {
  getUser: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
  
  setUser: (user: any) => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },
  
  removeUser: () => {
    localStorage.removeItem('user_data');
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
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token and user data
    tokenManager.setToken(response.token);
    userManager.setUser(response.student);
    
    return response;
  },
  
  register: async (userData: RegisterRequest): Promise<{ message: string }> => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  logout: () => {
    tokenManager.removeToken();
    userManager.removeUser();
  },
  
  getProfile: async () => {
    return await apiCall('/profile');
  },
  
  getDashboard: async () => {
    return await apiCall('/dashboard');
  }
};

// Health check
export const healthCheck = async () => {
  return await apiCall('/health');
};