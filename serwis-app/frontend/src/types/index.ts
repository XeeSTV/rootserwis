export interface User {
  id: number;
  username: string;
  role: string;
  email?: string;
  signature?: string;
}

export interface Client {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
}

export interface Repair {
  id: number;
  client_id: number;
  device: string;
  description?: string;
  status: 'przyjęte' | 'w naprawie' | 'gotowe' | 'odebrane' | 'anulowane';
  price_estimate?: number;
  code: string;
  created_at: string;
  updated_at: string;
  protocol_id?: number;
  client?: Client;
  protocol?: Protocol;
}

export interface Protocol {
  id: number;
  client_id: number;
  repair_id: number;
  device_info: string;
  price_estimate?: number;
  client_signature?: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CreateRepairRequest {
  client_name: string;
  client_company?: string;
  client_email?: string;
  client_phone?: string;
  device: string;
  description?: string;
  price_estimate?: number;
}

export interface UpdateRepairRequest {
  status?: string;
  price_estimate?: number;
  description?: string;
}

export interface CreateProtocolRequest {
  repair_id: number;
  device_info: string;
  price_estimate?: number;
  client_signature?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
} 