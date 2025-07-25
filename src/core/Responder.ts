export type ErrorResponse = {
  message: string;
};

export type BaseResponse = {
  code: number;
  success: boolean;
  message: string;
  data?: any;
  error?: ErrorResponse;
};

export type SuccessResponse<T> = BaseResponse & {
  data: T;
};

export const createSuccessResponse = <T>(
  data: T,
  message: string = "Success",
  code: number = 200,
): SuccessResponse<T> => ({
  code,
  success: true,
  message,
  data,
});

export const createErrorResponse = (
  error: string | ErrorResponse,
  message: string = "Error",
  code: number = 400,
): BaseResponse => ({
  code,
  success: false,
  message,
  error: typeof error === "string" ? { message: error } : error,
});
