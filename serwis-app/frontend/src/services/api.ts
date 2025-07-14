import axios, { AxiosInstance } from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  User, 
  Repair, 
  Client, 
  Protocol,
  CreateRepairRequest,
  UpdateRepairRequest,
  CreateProtocolRequest
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor do dodawania tokenu do każdego żądania
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor do obsługi błędów
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Autoryzacja
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Naprawy
  async getRepairs(): Promise<Repair[]> {
    const response = await this.api.get('/repairs');
    return response.data;
  }

  async getRepair(id: number): Promise<Repair> {
    const response = await this.api.get(`/repairs/${id}`);
    return response.data;
  }

  async getRepairByCode(code: string): Promise<Repair> {
    const response = await this.api.get(`/repairs/code/${code}`);
    return response.data;
  }

  async createRepair(repair: CreateRepairRequest): Promise<Repair> {
    const response = await this.api.post('/repairs', repair);
    return response.data;
  }

  async updateRepair(id: number, repair: UpdateRepairRequest): Promise<Repair> {
    const response = await this.api.put(`/repairs/${id}`, repair);
    return response.data;
  }

  async deleteRepair(id: number): Promise<void> {
    await this.api.delete(`/repairs/${id}`);
  }

  // Klienci
  async getClients(): Promise<Client[]> {
    const response = await this.api.get('/clients');
    return response.data;
  }

  async getClient(id: number): Promise<Client> {
    const response = await this.api.get(`/clients/${id}`);
    return response.data;
  }

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    const response = await this.api.post('/clients', client);
    return response.data;
  }

  async updateClient(id: number, client: Partial<Client>): Promise<Client> {
    const response = await this.api.put(`/clients/${id}`, client);
    return response.data;
  }

  async deleteClient(id: number): Promise<void> {
    await this.api.delete(`/clients/${id}`);
  }

  // Protokoły
  async getProtocols(): Promise<Protocol[]> {
    const response = await this.api.get('/protocols');
    return response.data;
  }

  async getProtocol(id: number): Promise<Protocol> {
    const response = await this.api.get(`/protocols/${id}`);
    return response.data;
  }

  async createProtocol(protocol: CreateProtocolRequest): Promise<Protocol> {
    const response = await this.api.post('/protocols', protocol);
    return response.data;
  }

  async generateProtocolPDF(id: number): Promise<Blob> {
    const response = await this.api.get(`/protocols/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Statystyki
  async getStats(): Promise<any> {
    const response = await this.api.get('/stats');
    return response.data;
  }
}

export const apiService = new ApiService(); 