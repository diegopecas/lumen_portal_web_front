import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderWebComponent } from '../../common/header-web/header-web.component';
import { ThemeService, ThemeConfig } from '../../services/theme.service';
import { ConfiguracionService, ContactoInfo } from '../../services/configuracion.service';
import { ContactoService, Catalogos, ContactoFormData, Catalogo } from '../../services/contacto.service';
import { AnalyticsService } from '../../services/analytics.service';

declare const Calendly: any;
declare var AOS: any;

interface FloatingParticle {
  x: number;
  y: number;
  delay: number;
  duration: number;
  icon: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderWebComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})
export class ContactoComponent implements OnInit, OnDestroy {

  public currentTheme!: ThemeConfig;
  public floatingParticles: FloatingParticle[] = [];

  // Información de contacto
  public contactInfo: ContactoInfo = {
    correos: [],
    telefono: '',
    whatsapp: '',
    horarios: {
      lunesViernes: '',
      extendido: '',
      sabados: ''
    },
    ubicacion: {
      direccion: '',
      mapsUrl: ''
    },
    redesSociales: {
      instagram: '',
      facebook: ''
    }
  };

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

  // Estados del formulario
  public mostrandoCargando = false;
  public mostrandoExito = false;
  public mostrandoCalendly = false;

  // Control de errores
  public errores: string[] = [];
  public mostrarErrores = false;

  // Campo detalle dinámico para "Cómo nos conoció"
  public mostrarComoConocioDetalle = false;
  public placeholderComoConocioDetalle = '';

  // Select personalizado programa
  public programaSelectOpen = false;

  // URL de Calendly
  private calendlyUrl = '';
  private calendlyScriptLoaded = false;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private configuracionService: ConfiguracionService,
    private contactoService: ContactoService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.generateFloatingParticles();
    this.cargarContactInfo();
    this.cargarCatalogos();

    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select-wrapper')) {
      this.programaSelectOpen = false;
    }
  }

  private generateFloatingParticles(): void {
    const numParticles = window.innerWidth <= 768 ? 12 : 25;
    this.floatingParticles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      icon: this.currentTheme.decorativeElements[
        Math.floor(Math.random() * this.currentTheme.decorativeElements.length)
      ]
    }));
  }

  private cargarContactInfo(): void {
    this.configuracionService.obtenerConfiguracionesContacto().subscribe({
      next: (response) => {
        if (response.success) {
          this.contactInfo = response.contacto;
        }
      },
      error: (error) => {
        console.error('Error cargando información de contacto:', error);
      }
    });
  }

  private cargarCatalogos(): void {
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

  // ========== MANEJO DEL SELECT PERSONALIZADO ==========

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

  // ========== CAMPO DINÁMICO "CÓMO NOS CONOCIÓ" ==========

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

  // ========== VALIDACIÓN DEL FORMULARIO ==========

  private validarFormulario(): boolean {
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

  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // ========== ENVÍO DEL FORMULARIO ==========

  enviarFormulario(): void {
    if (!this.validarFormulario()) {
      // Scroll al primer error
      const errorElement = document.querySelector('.alert-error');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.mostrandoCargando = true;
    this.errores = [];
    this.mostrarErrores = false;

    // 📊 Track envío de formulario
    this.analyticsService.trackEvent('formulario_contacto_envio', {
      event_category: 'formulario',
      event_label: 'Formulario enviado'
    });

    this.contactoService.crearContacto(this.formulario).subscribe({
      next: (response) => {
        this.mostrandoCargando = false;

        if (response.success) {
          console.log('✅ Contacto creado exitosamente:', response);

          // Guardar URL de Calendly
          if (response.calendly_url) {
            this.calendlyUrl = response.calendly_url;
          }

          // Mostrar mensaje de éxito
          this.mostrandoExito = true;

          // 📊 Track éxito
          this.analyticsService.trackEvent('formulario_contacto_exito', {
            event_category: 'conversion',
            event_label: 'Contacto creado'
          });

          // Scroll al mensaje de éxito
          setTimeout(() => {
            const exitoElement = document.querySelector('.mensaje-exito');
            if (exitoElement) {
              exitoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);

        } else {
          this.errores = response.errores || [response.message];
          this.mostrarErrores = true;

          // 📊 Track error
          this.analyticsService.trackEvent('formulario_contacto_error', {
            event_category: 'formulario',
            event_label: 'Error en validación'
          });
        }
      },
      error: (error) => {
        this.mostrandoCargando = false;
        this.errores = ['Error al enviar el formulario. Por favor intenta nuevamente.'];
        this.mostrarErrores = true;
        console.error('❌ Error enviando formulario:', error);

        // 📊 Track error técnico
        this.analyticsService.trackEvent('formulario_contacto_error_tecnico', {
          event_category: 'formulario',
          event_label: 'Error de red'
        });
      }
    });
  }

  // ========== CALENDLY ==========

  abrirCalendly(): void {
    if (!this.calendlyUrl) {
      console.error('URL de Calendly no disponible');
      return;
    }

    this.mostrandoCalendly = true;

    // 📊 Track apertura de Calendly
    this.analyticsService.trackEvent('calendly_abrir', {
      event_category: 'engagement',
      event_label: 'Widget Calendly abierto'
    });

    setTimeout(() => {
      this.cargarCalendly();
    }, 300);
  }

  private cargarCalendly(): void {
    if (!this.calendlyScriptLoaded) {
      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        this.calendlyScriptLoaded = true;
        this.inicializarCalendly();
      };
      document.body.appendChild(script);
    } else {
      this.inicializarCalendly();
    }
  }

  private inicializarCalendly(): void {
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

  agendarMasTarde(): void {
    // 📊 Track "agendar más tarde"
    this.analyticsService.trackEvent('calendly_agendar_mas_tarde', {
      event_category: 'engagement',
      event_label: 'Usuario decidió agendar después'
    });

    // Resetear formulario y estados
    this.resetearFormulario();
    this.mostrandoExito = false;
    this.mostrandoCalendly = false;

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private resetearFormulario(): void {
    this.formulario = {
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
    this.errores = [];
    this.mostrarErrores = false;
    this.mostrarComoConocioDetalle = false;
  }

  // ========== ACCIONES DE CONTACTO ==========

  sendWhatsApp(): void {
    // 📊 Track click en WhatsApp
    this.analyticsService.trackEvent('contacto_whatsapp_click', {
      event_category: 'interaction',
      event_label: 'Click en botón WhatsApp'
    });
    window.open(this.contactInfo.whatsapp, '_blank');
  }

  sendEmail(email: string): void {
    // 📊 Track click en email
    this.analyticsService.trackEvent('contacto_email_click', {
      event_category: 'interaction',
      event_label: `Click en email: ${email}`,
      email: email
    });
    window.location.href = `mailto:${email}`;
  }

  openMaps(): void {
    // 📊 Track click en Maps
    this.analyticsService.trackEvent('contacto_maps_click', {
      event_category: 'interaction',
      event_label: 'Click en Google Maps'
    });
    window.open(this.contactInfo.ubicacion.mapsUrl, '_blank');
  }

  openInstagram(): void {
    // 📊 Track click en Instagram
    this.analyticsService.trackEvent('redes_sociales_instagram', {
      event_category: 'social_media',
      event_label: 'Click en Instagram'
    });
    window.open(this.contactInfo.redesSociales.instagram, '_blank');
  }

  openFacebook(): void {
    // 📊 Track click en Facebook
    this.analyticsService.trackEvent('redes_sociales_facebook', {
      event_category: 'social_media',
      event_label: 'Click en Facebook'
    });
    window.open(this.contactInfo.redesSociales.facebook, '_blank');
  }

  llamarTelefono(): void {
    // 📊 Track click en teléfono
    this.analyticsService.trackEvent('contacto_telefono_click', {
      event_category: 'interaction',
      event_label: 'Click en teléfono'
    });
    window.location.href = `tel:${this.contactInfo.telefono}`;
  }
}