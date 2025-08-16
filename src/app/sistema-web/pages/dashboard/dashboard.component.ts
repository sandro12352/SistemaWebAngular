import { AfterViewInit, Component } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit{

  metrics = [
    { title: 'Ventas', value: '$12,345', subtitle: 'Este mes' },
    { title: 'Usuarios', value: '1,234', subtitle: 'Activos' },
    { title: 'Pedidos', value: '345', subtitle: 'En proceso' },
    { title: 'Productos', value: '567', subtitle: 'En inventario' },
  ];

  ngAfterViewInit(): void {
    // Gráfico de ventas
    new Chart('salesChart', {
      type: 'line',
      data: {
        labels: ['Enero','Febrero','Marzo','Abril','Mayo'],
        datasets: [{
          label: 'Ventas',
          data: [1200, 1900, 3000, 2500, 4000],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3
        }]
      }
    });

    // Gráfico de usuarios
    new Chart('usersChart', {
      type: 'bar',
      data: {
        labels: ['Lunes','Martes','Miércoles','Jueves','Viernes'],
        datasets: [{
          label: 'Usuarios Activos',
          data: [120, 150, 180, 200, 170],
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }]
      }
    });
  }

}
