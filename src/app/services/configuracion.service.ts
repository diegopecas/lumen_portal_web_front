import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ConfiguracionesPublicas {
  google_analytics_id?: string;
  calendly_url?: string;
  honeypot_enabled?: boolean;
  [key: string]: any; // Para otras configuraciones futuras
}

export interface ConfiguracionResponse {
  success: boolean;
  configuraciones: ConfiguracionesPublicas;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private apiUrl = environment.apiUrl + '/configuraciones';

  constructor(private http: HttpClient) {}

  /**
   * Obtener configuraciones públicas del portal
   */
  obtenerConfiguracionesPublicas(): Observable<ConfiguracionResponse> {
    return this.http.get<ConfiguracionResponse>(`${this.apiUrl}/publicas`).pipe(
      tap(response => {
        console.log('✅ Configuraciones públicas obtenidas:', response);
      }),
      catchError(error => {
        console.error('❌ Error obteniendo configuraciones públicas:', error);
        return of({
          success: false,
          configuraciones: {}
        });
      })
    );
  }
}