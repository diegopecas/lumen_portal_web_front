# Lumen Web - Frontend

Sitio web de Liceo Lumen construido con Angular 18 (Standalone Components).

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd lumen-web
npm install
```

### 2. Configurar backend

Asegúrate de que el backend esté corriendo en:
```
http://localhost:9999
```

### 3. Iniciar servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

## 📁 Estructura del Proyecto

```
lumen-web/
├── src/
│   ├── app/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── models/             # Interfaces TypeScript
│   │   ├── services/           # Servicios HTTP
│   │   ├── app.component.ts    # Componente principal
│   │   ├── app.config.ts       # Configuración
│   │   └── app.routes.ts       # Rutas
│   │
│   ├── assets/                 # Recursos estáticos
│   ├── environments/           # Configuraciones por ambiente
│   │   ├── environment.ts      # Desarrollo
│   │   └── environment.prod.ts # Producción
│   │
│   ├── index.html              # HTML principal
│   ├── main.ts                 # Bootstrap
│   └── styles.scss             # Estilos globales
│
├── angular.json                # Configuración Angular CLI
├── package.json                # Dependencias
└── tsconfig.json               # Configuración TypeScript
```

## 🎯 Características Actuales

### ✅ Test de Conexión API
- **Test API Básico:** Verifica conexión con el backend
- **Test Base de Datos:** Verifica conexión a MySQL
- **Health Check:** Estado del servicio
- **Manejo de errores:** Mensajes claros de error

### 🎨 Diseño
- Tema dorado institucional de Lumen
- Responsive (móvil y desktop)
- Animaciones suaves
- Loading states

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm start                 # Inicia servidor dev en localhost:4200

# Build
npm run build            # Build de producción
npm run watch            # Build en modo watch

# Testing
npm test                 # Ejecuta tests unitarios
```

## 🌐 Configuración de Ambientes

### Desarrollo (`environment.ts`)
```typescript
apiUrl: 'http://localhost:9999/api'
```

### Producción (`environment.prod.ts`)
```typescript
apiUrl: 'https://liceolumen.com/api'
```

## 📝 Próximos Pasos

1. ✅ Conexión API funcionando
2. ⏳ Crear secciones de la página
   - Hero
   - Servicios
   - Galería
   - Valores
   - Equipo
   - Contacto
3. ⏳ Formulario de contacto funcional
4. ⏳ Integración con backend completo

## 🎨 Paleta de Colores

```scss
$gold: #D4AF37;
$gold-light: #E6C757;
$gold-dark: #B8941F;
$black: #1a1a1a;
$gray-dark: #333333;
$white: #ffffff;
$cream: #FFF8E7;
```

## 📞 Soporte

Desarrollado para Liceo Lumen - Jardín Infantil
Chía, Colombia
