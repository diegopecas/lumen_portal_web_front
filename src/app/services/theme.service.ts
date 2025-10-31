import { Injectable } from '@angular/core';

export interface ThemeConfig {
  name: string;
  month: number;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  title: string;
  subtitle: string;
  decorativeElements: string[];
  particleIcons: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themes: ThemeConfig[] = [
    // Enero - Año Nuevo
    {
      name: 'new-year',
      month: 1,
      backgroundColor: 'linear-gradient(to bottom, #2a1f5a 0%, #504c60 50%, #694ea4 100%)',
      primaryColor: '#ffd700',
      secondaryColor: '#c06c98ff',
      accentColor: '#00ffff',
      title: 'LICEO LUMEN',
      subtitle: '✨ Nuevo Año, Nuevos Sueños ✨',
      decorativeElements: ['🎆', '🎊', '✨', '🎉'],
      particleIcons: ['✨', '🎊', '🎆', '⭐']
    },
    // Febrero - San Valentín
    {
      name: 'valentine',
      month: 2,
      backgroundColor: 'linear-gradient(to bottom, #2d0a1e 0%, #4a0a2e 50%, #6d1040 100%)',
      primaryColor: '#ff1493',
      secondaryColor: '#ff69b4',
      accentColor: '#ffb6c1',
      title: 'LICEO LUMEN',
      subtitle: '💕 Con Amor y Dedicación 💕',
      decorativeElements: ['💖', '💝', '💗', '💓'],
      particleIcons: ['💕', '💖', '💗', '💝']
    },
    // Marzo - Primavera
    {
      name: 'spring',
      month: 3,
      backgroundColor: 'linear-gradient(to bottom, #1a3a1a 0%, #2d5a2d 50%, #407a40 100%)',
      primaryColor: '#32cd32',
      secondaryColor: '#ff69b4',
      accentColor: '#ffff00',
      title: 'LICEO LUMEN',
      subtitle: '🌸 Floreciendo con Conocimiento 🌸',
      decorativeElements: ['🌸', '🦋', '🌺', '🌼'],
      particleIcons: ['🌸', '🌺', '🦋', '🌼']
    },
    // Abril - Pascua
    {
      name: 'easter',
      month: 4,
      backgroundColor: 'linear-gradient(to bottom, #4a2a0a 0%, #6a4a2a 50%, #8a6a4a 100%)',
      primaryColor: '#ffd700',
      secondaryColor: '#ff69b4',
      accentColor: '#87ceeb',
      title: 'LICEO LUMEN',
      subtitle: '🐰 Renovación y Esperanza 🐰',
      decorativeElements: ['🐰', '🥚', '🐣', '🌷'],
      particleIcons: ['🐰', '🥚', '🐣', '🌷']
    },
    // Mayo - Día de las Madres
    {
      name: 'mothers-day',
      month: 5,
      backgroundColor: 'linear-gradient(to bottom, #2d1a3a 0%, #4a2a5a 50%, #6a4a7a 100%)',
      primaryColor: '#ff69b4',
      secondaryColor: '#dda0dd',
      accentColor: '#fff',
      title: 'LICEO LUMEN',
      subtitle: '👩 Celebrando a Mamá 👩',
      decorativeElements: ['🌹', '💝', '🌺', '💐'],
      particleIcons: ['🌹', '💝', '🌺', '💐']
    },
    // Junio - Verano
    {
      name: 'summer',
      month: 6,
      backgroundColor: 'linear-gradient(to bottom, #0a3a5a 0%, #1a5a8a 50%, #2a7aba 100%)',
      primaryColor: '#ffd700',
      secondaryColor: '#ff8c00',
      accentColor: '#00bfff',
      title: 'LICEO LUMEN',
      subtitle: '☀️ Verano de Aprendizaje ☀️',
      decorativeElements: ['☀️', '🌊', '🏖️', '🍉'],
      particleIcons: ['☀️', '🌊', '🏖️', '⛱️']
    },
    // Julio - Patria Colombia
    {
      name: 'colombia-day',
      month: 7,
      backgroundColor: 'linear-gradient(to bottom, #1a1a3a 0%, #2a2a5a 50%, #3a3a7a 100%)',
      primaryColor: '#fcd116',
      secondaryColor: '#003893',
      accentColor: '#ce1126',
      title: 'LICEO LUMEN',
      subtitle: '🇨🇴 Orgullo Colombiano 🇨🇴',
      decorativeElements: ['🇨🇴', '⭐', '🎆', '🎉'],
      particleIcons: ['🇨🇴', '⭐', '🎆', '🎉']
    },
    // Agosto - Cometas
    {
      name: 'kites',
      month: 8,
      backgroundColor: 'linear-gradient(to bottom, #2a3a5a 0%, #4a5a8a 50%, #6a7aba 100%)',
      primaryColor: '#00bfff',
      secondaryColor: '#ff69b4',
      accentColor: '#ffd700',
      title: 'LICEO LUMEN',
      subtitle: '🪁 Volando Alto 🪁',
      decorativeElements: ['🪁', '☁️', '🌈', '🦅'],
      particleIcons: ['🪁', '☁️', '🌈', '✨']
    },
    // Septiembre - Amor y Amistad
    {
      name: 'love-friendship',
      month: 9,
      backgroundColor: 'linear-gradient(to bottom, #3a1a2a 0%, #5a2a4a 50%, #7a3a6a 100%)',
      primaryColor: '#ff1493',
      secondaryColor: '#ff69b4',
      accentColor: '#ffd700',
      title: 'LICEO LUMEN',
      subtitle: '💖 Amor y Amistad 💖',
      decorativeElements: ['💖', '💕', '🎁', '🎈'],
      particleIcons: ['💖', '💕', '💝', '🎁']
    },
    // Octubre - Halloween
    {
      name: 'halloween',
      month: 10,
      backgroundColor: 'linear-gradient(to bottom, #0a0a1a 0%, #1a0a2e 50%, #2d1b3d 100%)',
      primaryColor: '#ff8c00',
      secondaryColor: '#8a2be2',
      accentColor: '#dda0dd',
      title: 'LICEO LUMEN',
      subtitle: '🕸️ Portal de las Sombras 🕸️',
      decorativeElements: ['🦇', '👻', '🕷️', '🕸️'],
      particleIcons: ['🎃', '👻', '🕷️', '🕸️']
    },
    // Noviembre - Acción de Gracias
    {
      name: 'thanksgiving',
      month: 11,
      backgroundColor: 'linear-gradient(to bottom, #f5f0e8 0%, #e8dcc8 50%, #d4c4a8 100%)',
      primaryColor: '#d99058',
      secondaryColor: '#c1774a',
      accentColor: '#fce4d3',
      title: 'LICEO LUMEN',
      subtitle: '🍂 Gratitud y Abundancia 🍂',
      decorativeElements: ['🍂', '🦃', '🌾', '🍁'],
      particleIcons: ['🍂', '🍁', '🌾', '🦃']
    },
    // Diciembre - Navidad
    {
      name: 'christmas',
      month: 12,
      backgroundColor: 'linear-gradient(to bottom, #0a1428 0%, #1a2850 50%, #2a3c78 100%)',
      primaryColor: '#e0f4ff',
      secondaryColor: '#4dd0ff',
      accentColor: '#ffffff',
      title: 'LICEO LUMEN',
      subtitle: '❄️ Magia Invernal ❄️',
      decorativeElements: ['❄️', '⛄', '🎄', '✨', '🎅', '🔔', '⛷️'],
      particleIcons: ['❄️', '✨', '⭐', '💎', '🎅']
    }
  ];

  getCurrentTheme(): ThemeConfig {
    //const currentMonth = new Date().getMonth() + 1;
    const currentMonth = 12;
    return this.themes.find(t => t.month === currentMonth) || this.themes[9]; // Default Halloween
  }

  getThemeByMonth(month: number): ThemeConfig {
    return this.themes.find(t => t.month === month) || this.themes[9];
  }

  getAllThemes(): ThemeConfig[] {
    return this.themes;
  }
}