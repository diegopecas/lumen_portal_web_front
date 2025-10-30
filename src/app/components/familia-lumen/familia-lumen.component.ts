import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderWebComponent } from '../../common/header-web/header-web.component';
import { ThemeService, ThemeConfig } from '../../services/theme.service';
import { ConfiguracionService, ContactoInfo } from '../../services/configuracion.service';

declare var AOS: any;

interface Documento {
  id: number;
  titulo: string;
  descripcion: string;
  archivo: string;
  icono: string;
  carpeta: string;
}

interface CategoriaDocumento {
  id: string;
  titulo: string;
  icono: string;
  descripcion: string;
  orden: number;
  documentos: Documento[];
}

interface CalendarioMes {
  mes: string;
  numero: number;
  imagen: string;
  disponible: boolean;
}

@Component({
  selector: 'app-familia-lumen',
  standalone: true,
  imports: [CommonModule, HeaderWebComponent, HttpClientModule, FormsModule],
  templateUrl: './familia-lumen.component.html',
  styleUrl: './familia-lumen.component.scss'
})
export class FamiliaLumenComponent implements OnInit {

  public currentTheme!: ThemeConfig;
  public categorias: CategoriaDocumento[] = [];
  public categoriasFiltradas: CategoriaDocumento[] = [];
  public searchTerm: string = '';

  public calendarios: CalendarioMes[] = [];
  public mesActual: number = new Date().getMonth();
  public calendarioSeleccionado: CalendarioMes | null = null;

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

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private http: HttpClient,
    private configuracionService: ConfiguracionService
  ) { }

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.loadDocuments();
    this.loadContactInfo();
    this.initCalendarios();

    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  }

  private loadContactInfo(): void {
    this.configuracionService.obtenerConfiguracionesContacto().subscribe({
      next: (response) => {
        if (response.success) {
          this.contactInfo = response.contacto;
        }
      },
      error: (error) => {
        console.error('Error loading contact info:', error);
      }
    });
  }

  private loadDocuments(): void {
    this.http.get<{ categorias: CategoriaDocumento[] }>('assets/data/documentos.json')
      .subscribe({
        next: (data) => {
          this.categorias = data.categorias.sort((a, b) => a.orden - b.orden);
          this.categoriasFiltradas = [...this.categorias];
        },
        error: (error) => {
          console.error('Error loading documents:', error);
        }
      });
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value.toLowerCase().trim();

    if (!this.searchTerm) {
      this.categoriasFiltradas = [...this.categorias];
      return;
    }

    this.categoriasFiltradas = this.categorias
      .map(categoria => {
        const documentosFiltrados = categoria.documentos.filter(doc =>
          doc.titulo.toLowerCase().includes(this.searchTerm) ||
          doc.descripcion.toLowerCase().includes(this.searchTerm)
        );

        if (documentosFiltrados.length > 0) {
          return {
            ...categoria,
            documentos: documentosFiltrados
          };
        }
        return null;
      })
      .filter(categoria => categoria !== null) as CategoriaDocumento[];
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.categoriasFiltradas = [...this.categorias];
  }

  getTotalDocumentos(): number {
    return this.categoriasFiltradas.reduce(
      (total, categoria) => total + categoria.documentos.length,
      0
    );
  }

  private initCalendarios(): void {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    for (let i = 0; i <= 9; i++) {
      this.calendarios.push({
        mes: meses[i],
        numero: i,
        imagen: `assets/images/calendarios/${meses[i].toLowerCase()}.png`,
        disponible: i <= this.mesActual
      });
    }

    this.calendarioSeleccionado = this.calendarios[this.mesActual];
  }

  seleccionarCalendario(calendario: CalendarioMes): void {
    if (calendario.disponible) {
      this.calendarioSeleccionado = calendario;
    }
  }

  downloadDocument(documento: Documento): void {
    const ruta = `assets/documents/${documento.carpeta}/${documento.archivo}`;
    window.open(ruta, '_blank');
  }

  goToPortalPadres(): void {
    window.open('https://padres.liceolumen.com/#/login', '_blank');
  }

  sendWhatsApp(): void {
    window.open(this.contactInfo.whatsapp, '_blank');
  }

  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  openMaps(): void {
    window.open(this.contactInfo.ubicacion.mapsUrl, '_blank');
  }
}