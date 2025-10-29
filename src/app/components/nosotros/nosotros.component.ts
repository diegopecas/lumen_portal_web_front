import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderWebComponent } from '../../common/header-web/header-web.component';


@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, HeaderWebComponent],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.scss'
})
export class NosotrosComponent {

  valores = [
    {
      icon: '❤️',
      titulo: 'Amor',
      color: '#e74c3c',
      descripcion: 'La fuerza que impulsa nuestro trabajo y guía nuestra labor educativa'
    },
    {
      icon: '💛',
      titulo: 'Respeto',
      color: '#f39c12',
      descripcion: 'Fomentamos el respeto mutuo, la inclusión y la diversidad'
    },
    {
      icon: '☀️',
      titulo: 'Autonomía',
      color: '#f1c40f',
      descripcion: 'Promovemos la independencia y el desarrollo de habilidades propias en cada niño'
    }
  ];

  caracteristicas = [
    {
      icon: '🎨',
      titulo: 'Aprendizaje Experiencial',
      descripcion: 'Programa educativo innovador que combina enseñanza tradicional con exploración y descubrimiento'
    },
    {
      icon: '🌍',
      titulo: 'Inglés Integrado',
      descripcion: 'Clases de inglés como parte integral del programa para desarrollar habilidades comunicativas desde temprana edad'
    },
    {
      icon: '⚽',
      titulo: 'Actividades Integrales',
      descripcion: 'Deportes y actividades lúdicas que promueven el desarrollo físico y emocional'
    },
    {
      icon: '🌳',
      titulo: 'Entorno Natural',
      descripcion: 'Espacios verdes y seguros que estimulan el aprendizaje en contacto con la naturaleza'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      titulo: 'Atención Personalizada',
      descripcion: 'Grupos reducidos para garantizar una educación adaptada a cada niño'
    },
    {
      icon: '✨',
      titulo: 'Precios Justos',
      descripcion: 'Educación de calidad accesible para todas las familias'
    }
  ];

  equipo = [
    {
      nombre: 'Santiago',
      emoji: '👨‍💼',
      descripcion: 'Cofundador lleno de energía y visión emprendedora. Líder natural apasionado por la tecnología y la innovación educativa.'
    },
    {
      nombre: 'María del Pilar',
      emoji: '👩‍💼',
      descripcion: 'Cofundadora, ingeniera en sistemas con maestría. Amplia experiencia en gestión de equipos y compromiso con la educación de calidad.'
    },
    {
      nombre: 'Diego',
      emoji: '👨‍🏫',
      descripcion: 'Cofundador, ingeniero en sistemas con experiencia docente. Visión integral para implementar soluciones tecnológicas y educativas innovadoras.'
    }
  ];
}
