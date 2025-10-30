import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Catalogo {
    id: number;
    nombre: string;
    descripcion?: string;
    pide_detalle?: string;
    placeholder_detalle?: string;
}

export interface Catalogos {
    tipos_consulta: Catalogo[];
    tipos_como_conocio: Catalogo[];
    programas_interes: Catalogo[];
}

export interface ContactoFormData {
    nombre_padre: string;
    email: string;
    telefono: string;
    edad_nino?: number;
    mensaje: string;
    id_tipo_consulta: number;
    id_como_conocio: number;
    como_conocio_detalle?: string;
    id_programa_interes?: number;
    honeypot?: string;
}

export interface ContactoResponse {
    success: boolean;
    message: string;
    contacto_id?: number;
    email?: string;
    calendly_url?: string;
    errores?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ContactoService {
    private apiUrl = environment.apiUrl + '/contactos';

    constructor(private http: HttpClient) { }

    obtenerCatalogos(): Observable<{ success: boolean; catalogos: Catalogos }> {
        return this.http.get<{ success: boolean; catalogos: Catalogos }>(`${this.apiUrl}/catalogos`).pipe(
            tap(response => {
                
            }),
            catchError(error => {
                console.error('Error obteniendo catálogos:', error);
                return of({
                    success: false,
                    catalogos: {
                        tipos_consulta: [],
                        tipos_como_conocio: [],
                        programas_interes: []
                    }
                });
            })
        );
    }

    crearContacto(datos: ContactoFormData): Observable<ContactoResponse> {
        return this.http.post<ContactoResponse>(`${this.apiUrl}/contactos`, datos).pipe(
            tap(response => {
                console.log('Contacto creado:', response);
            }),
            catchError(error => {
                console.error('Error creando contacto:', error);
                return of({
                    success: false,
                    message: 'Error al enviar el formulario. Por favor intenta nuevamente.',
                    errores: error.error?.errores || []
                });
            })
        );
    }
}