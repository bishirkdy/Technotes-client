import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({ selector:'app-login', imports:[FormsModule,RouterLink], templateUrl:'./login.html', styleUrl:'./login.css' })
export class Login {
  private readonly auth=inject(AuthService); private readonly router=inject(Router);
  email=''; password=''; loading=false; error='';
  submit(){this.error='';if(!this.email||!this.password){this.error='Email and password are required.';return;}this.loading=true;this.auth.login(this.email,this.password).subscribe({next:()=>{this.loading=false;this.router.navigate(['/app/dashboard']);},error:e=>{this.loading=false;this.error=e?.error?.detail||e?.error?.message||'Invalid email or password.';}});}
}
