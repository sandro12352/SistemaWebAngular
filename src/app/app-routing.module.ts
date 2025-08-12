import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'auth',
    loadChildren:() =>import('./auth/auth.module').then(m=>m.AuthModule),
  },
  {
    path:'app',
    loadChildren:()=>import('./sistema-web/sistema-web.module').then(m=>m.SistemaWebModule),
  },
  {
    path:'**',
    redirectTo:'auth',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
