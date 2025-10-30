import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { FamiliaLumenComponent } from './components/familia-lumen/familia-lumen.component';
import { ContactoComponent } from './components/contacto/contacto.component';

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent
  },
  {
    path: 'nosotros',
    component: NosotrosComponent
  },
  {
    path: 'galeria',
    component: GaleriaComponent
  },
  {
    path: 'familia-lumen',
    component: FamiliaLumenComponent
  },
  {
    path: 'contacto',
    component: ContactoComponent
  }
];
