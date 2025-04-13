import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://mock-bank-mock-back.yexuz7.easypanel.host';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const api = async <T>(
  endpoint: string,
  method: ApiMethod,
  body?: any
): Promise<T> => {
  try {
    const token = await SecureStore.getItemAsync('jwt');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Erro desconhecido na requisição');
  }
};