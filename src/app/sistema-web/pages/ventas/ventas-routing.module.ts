import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarVentaComponent } from './pages/registrar-venta/registrar-venta.component';
import { VerVentasComponent } from './pages/ver-ventas/ver-ventas.component';
import { DetalleVentaComponent } from './pages/detalle-venta/detalle-venta.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {path:'registrar',component:RegistrarVentaComponent},
      {path:'ver',component:VerVentasComponent},
      {path:'ver/:id',component:DetalleVentaComponent}
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
