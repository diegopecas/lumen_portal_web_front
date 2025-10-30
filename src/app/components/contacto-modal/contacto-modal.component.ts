import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactoService, Catalogos, ContactoFormData, Catalogo } from '../../services/contacto.service';
import { ThemeService, ThemeConfig } from '../../services/theme.service';

declare const Calendly: any;

@Component({
    selector: 'app-contacto-modal',
    templateUrl: './contacto-modal.component.html',
    styleUrls: ['./contacto-modal.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class ContactoModalComponent implements OnInit, OnDestroy {

    // Control del modal
    public mostrarModal = false;
    private modalMostrado = false;
    private timerModal: any;

    // Estados del modal
    public mostrandoFormulario = true;
    public mostrandoCalendly = false;
    public mostrandoConfirmacion = false;
    public mostrandoCargando = false;

    // Tema actual
    public currentTheme!: ThemeConfig;
    public mensajeEspecial: string = '';

    // Catálogos
    public catalogos: Catalogos = {
        tipos_consulta: [],
        tipos_como_conocio: [],
        programas_interes: []
    };

    // Datos del formulario
    public formulario: ContactoFormData = {
        nombre_padre: '',
        email: '',
        telefono: '',
        edad_nino: undefined,
        mensaje: '',
        id_tipo_consulta: 0,
        id_como_conocio: 0,
        como_conocio_detalle: '',
        id_programa_interes: undefined,
        honeypot: ''
    };

    // Control de errores
    public errores: string[] = [];
    public mostrarErrores = false;

    // Campo detalle dinámico para "Cómo nos conoció"
    public mostrarComoConocioDetalle = false;
    public placeholderComoConocioDetalle = '';

    // URL de Calendly
    private calendlyUrl = '';

    public programaSelectOpen = false;

    constructor(
        private contactoService: ContactoService,
        private themeService: ThemeService
    ) { }

    ngOnInit(): void {
        // Cargar tema actual
        this.currentTheme = this.themeService.getCurrentTheme();
        this.mensajeEspecial = this.obtenerMensajeEspecial();

        // Cargar catálogos
        this.cargarCatalogos();

        // LIMPIAR sessionStorage al cargar el componente
        const modalYaMostrado = sessionStorage.getItem('modal_contacto_mostrado');

        if (!modalYaMostrado) {
            // Iniciar timer para mostrar modal después de 5 segundos
            this.timerModal = setTimeout(() => {
                this.abrirModal();
            }, 5000);
        }
    }

    ngOnDestroy(): void {
        if (this.timerModal) {
            clearTimeout(this.timerModal);
        }
    }

    @HostListener('document:keydown.escape', ['$event'])
    onEscapeKey(event: KeyboardEvent): void {
        this.cerrarModal();
    }

    /**
     * Obtener mensaje especial según el mes
     */
    private obtenerMensajeEspecial(): string {
        const mensajes: { [key: string]: string } = {
            'new-year': '¡Comienza el año con nosotros! Descubre un espacio donde tus hijos brillarán ✨',
            'valentine': 'Con amor construimos el futuro de tus pequeños 💕',
            'spring': 'Como las flores, aquí tus hijos florecerán con alegría 🌸',
            'easter': 'Un nuevo comienzo lleno de aprendizaje y diversión 🐰',
            'mothers-day': 'Para las mamás que quieren lo mejor para sus hijos 💐',
            'summer': 'Descubre nuestro mundo de aventuras y aprendizaje ☀️',
            'colombia-day': '¡Con orgullo colombiano educamos el futuro! 🇨🇴',
            'kites': 'Elevamos los sueños de tus hijos cada día 🪁',
            'love-friendship': 'Donde se cultiva el amor, la amistad y el conocimiento 💖',
            'halloween': 'Un lugar mágico donde tus hijos vivirán aventuras encantadas 🎃',
            'thanksgiving': 'Agradecidos por formar parte de tu familia 🍂',
            'christmas': '¡La magia de la navidad en cada rincón de Lumen! ❄️🎄'
        };

        return mensajes[this.currentTheme.name] || 'Conoce nuestras instalaciones y programas educativos';
    }

    /**
     * Cargar catálogos desde el backend
     */
    cargarCatalogos(): void {
        this.contactoService.obtenerCatalogos().subscribe({
            next: (response) => {
                if (response.success) {
                    this.catalogos = response.catalogos;
                }
            },
            error: (error) => {
                console.error('Error cargando catálogos:', error);
            }
        });
    }

    /**
     * Abrir modal automáticamente
     */
    abrirModal(): void {
        if (!this.modalMostrado) {
            this.mostrarModal = true;
            this.modalMostrado = true;
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Abrir modal manualmente (desde botón)
     */
    abrirModalManual(): void {
        this.mostrarModal = true;
        this.resetearEstados();
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cerrar modal
     */
    cerrarModal(): void {
        this.mostrarModal = false;
        document.body.style.overflow = 'auto';

        // Marcar que ya se mostró en esta SESIÓN
        sessionStorage.setItem('modal_contacto_mostrado', 'true');
    }

    /**
     * Resetear estados del modal
     */
    resetearEstados(): void {
        this.mostrandoFormulario = true;
        this.mostrandoCalendly = false;
        this.mostrandoConfirmacion = false;
        this.mostrandoCargando = false;
        this.errores = [];
        this.mostrarErrores = false;
    }

    /**
     * Detectar cambio en "Cómo nos conoció"
     */
    onComoConocioChange(): void {
        const seleccionado = this.catalogos.tipos_como_conocio.find(
            tipo => tipo.id === this.formulario.id_como_conocio
        );

        if (seleccionado && seleccionado.pide_detalle === 'si') {
            this.mostrarComoConocioDetalle = true;
            this.placeholderComoConocioDetalle = seleccionado.placeholder_detalle || 'Por favor especifica';
        } else {
            this.mostrarComoConocioDetalle = false;
            this.formulario.como_conocio_detalle = '';
        }
    }

    /**
     * Validar formulario en el frontend
     */
    validarFormulario(): boolean {
        this.errores = [];

        if (!this.formulario.nombre_padre || this.formulario.nombre_padre.trim().length < 3) {
            this.errores.push('El nombre debe tener al menos 3 caracteres');
        }

        if (!this.formulario.email || !this.validarEmail(this.formulario.email)) {
            this.errores.push('Email inválido');
        }

        if (!this.formulario.telefono || this.formulario.telefono.trim().length < 7) {
            this.errores.push('Teléfono inválido');
        }

        if (!this.formulario.mensaje || this.formulario.mensaje.trim().length < 10) {
            this.errores.push('El mensaje debe tener al menos 10 caracteres');
        }

        if (!this.formulario.id_tipo_consulta || this.formulario.id_tipo_consulta === 0) {
            this.errores.push('Debes seleccionar un tipo de consulta');
        }

        if (!this.formulario.id_como_conocio || this.formulario.id_como_conocio === 0) {
            this.errores.push('Debes indicar cómo nos conociste');
        }

        if (this.mostrarComoConocioDetalle && !this.formulario.como_conocio_detalle) {
            this.errores.push('Por favor completa el campo de detalle');
        }

        this.mostrarErrores = this.errores.length > 0;

        return this.errores.length === 0;
    }

    /**
     * Validar formato de email
     */
    validarEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Enviar formulario
     */
    enviarFormulario(): void {
        if (!this.validarFormulario()) {
            return;
        }

        this.mostrandoCargando = true;
        this.errores = [];
        this.mostrarErrores = false;

        this.contactoService.crearContacto(this.formulario).subscribe({
            next: (response) => {
                this.mostrandoCargando = false;

                if (response.success) {
                    console.log('Contacto creado exitosamente:', response);

                    if (response.calendly_url) {
                        this.calendlyUrl = response.calendly_url;
                    }

                    this.mostrandoFormulario = false;
                    this.mostrandoCalendly = true;

                    setTimeout(() => {
                        this.cargarCalendly();
                    }, 300);

                } else {
                    this.errores = response.errores || [response.message];
                    this.mostrarErrores = true;
                }
            },
            error: (error) => {
                this.mostrandoCargando = false;
                this.errores = ['Error al enviar el formulario. Por favor intenta nuevamente.'];
                this.mostrarErrores = true;
                console.error('Error enviando formulario:', error);
            }
        });
    }

    /**
     * Cargar widget de Calendly
     */
    cargarCalendly(): void {
        if (!this.calendlyUrl) {
            console.error('URL de Calendly no disponible');
            return;
        }

        if (!document.getElementById('calendly-script')) {
            const script = document.createElement('script');
            script.id = 'calendly-script';
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = () => {
                this.inicializarCalendly();
            };
            document.body.appendChild(script);
        } else {
            this.inicializarCalendly();
        }
    }

    /**
     * Inicializar widget de Calendly
     */
    inicializarCalendly(): void {
        if (typeof Calendly !== 'undefined') {
            let mensajePreparacion = '';

            if (this.formulario.mensaje) {
                mensajePreparacion = this.formulario.mensaje;
            }

            mensajePreparacion += `\n\n--- Información adicional ---`;
            mensajePreparacion += `\nTeléfono: ${this.formulario.telefono}`;

            if (this.formulario.edad_nino) {
                mensajePreparacion += `\nEdad del niño: ${this.formulario.edad_nino} años`;
            }

            if (this.formulario.id_programa_interes) {
                const programa = this.catalogos.programas_interes.find(p => p.id === this.formulario.id_programa_interes);
                if (programa) {
                    mensajePreparacion += `\nPrograma de interés: ${programa.nombre}`;
                }
            }

            Calendly.initInlineWidget({
                url: this.calendlyUrl,
                parentElement: document.getElementById('calendly-container'),
                prefill: {
                    name: this.formulario.nombre_padre,
                    email: this.formulario.email,
                    customAnswers: {
                        a1: mensajePreparacion
                    }
                },
                utm: {}
            });
        }
    }

    /**
     * Volver al formulario
     */
    volverAlFormulario(): void {
        this.mostrandoCalendly = false;
        this.mostrandoFormulario = true;
    }
    toggleProgramaSelect(): void {
        this.programaSelectOpen = !this.programaSelectOpen;
    }

    selectPrograma(id: number | undefined): void {
        this.formulario.id_programa_interes = id;
        this.programaSelectOpen = false;
    }

    getProgramaNombre(id: number): string {
        const programa = this.catalogos.programas_interes.find(p => p.id === id);
        return programa ? programa.nombre : '';
    }

    // Agregar un HostListener para cerrar el select al hacer click fuera
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.custom-select-wrapper')) {
            this.programaSelectOpen = false;
        }
    }
}