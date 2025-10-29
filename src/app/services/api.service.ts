import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiTestResponse, ApiErrorResponse } from '../models/api-response.interface';

/**
 * Servicio para comunicación con el backend
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Test básico del API
   * GET /api/test
   */
  testApi(): Observable<ApiTestResponse> {
    return this.http.get<ApiTestResponse>(`${this.apiUrl}/test`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Test de conexión a base de datos
   * GET /api/test/db
   */
  testDatabase(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/test/db`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Health check del API
   * GET /api/health
   */
  healthCheck(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/health`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      }
    }

    console.error('Error en petición HTTP:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
