/**
 * Interface para la respuesta del endpoint /api/test
 */
export interface ApiTestResponse {
  success: boolean;
  message: string;
  timestamp: string;
  timezone: string;
  version: string;
}

/**
 * Interface genérica para respuestas de error
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  status?: number;
}
