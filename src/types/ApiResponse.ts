export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  error?: string;
  errors?: string[];
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
