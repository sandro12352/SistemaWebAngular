import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaWebRoutingModule } from './sistema-web-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { InventarioModule } from './pages/inventario/inventario.module';
import { VentasModule } from './pages/ventas/ventas.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    SidebarComponent,
    TopbarComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
   
    SistemaWebRoutingModule
  ]
})
export class SistemaWebModule { }
