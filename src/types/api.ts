export interface ApiResponse<T> {
    data?: T;
    error?: string;
  }
  
  export type ApiError = {
    message: string;
    statusCode: number;
  };