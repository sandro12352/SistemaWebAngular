import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutPageComponent,
    children:[
      {
        path:'',
        component:DashboardComponent,
      },
      {
        path:'ventas',
        loadChildren:()=>import('./pages/ventas/ventas.module').then(m=>m.VentasModule)
      },
      {path:'inventario',
        loadChildren:()=>import('./pages/inventario/inventario.module').then(m=>m.InventarioModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaWebRoutingModule { }
