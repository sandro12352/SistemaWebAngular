import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
declare var bootstrap: any;
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  public loginForm:FormGroup;
  public errorMessage: string = '';
  @ViewChild('redirectModal', { static: false }) redirectModalRef!: ElementRef;
 

  constructor(
    private authService:AuthService,
    private fb:FormBuilder,
    private router:Router
  ){
      this.loginForm = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    })

  }


  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.validarLogin(email, password).subscribe({
      next: (usuario) => {
        console.log('Login exitoso', usuario);
        // Mostrar el modal
          const modal = new bootstrap.Modal(this.redirectModalRef.nativeElement);
          modal.show();

          // Redirigir después de 2 segundos
          setTimeout(() => {
            modal.hide();
            this.router.navigate(['/app']);
          }, 2000);
        },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error inesperado al iniciar sesión';
      }
    });
    
  }


}
