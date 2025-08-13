import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  
  isVisible = true;
  isAnimating = false;
  toggleSidebar() {
  if (this.isVisible) {
    this.isVisible = false;
  } else {
    this.isVisible = true;
  }
}







}
