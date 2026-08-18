export * from './models';
export * from './navigation';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  code?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
