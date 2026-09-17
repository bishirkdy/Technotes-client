import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({ selector:'app-sidebar', imports:[RouterLink,RouterLinkActive], templateUrl:'./sidebar.html', styleUrl:'./sidebar.css' })
export class Sidebar {
  private readonly auth=inject(AuthService); private readonly router=inject(Router);
  get user(){return this.auth.user;}
  logout(){this.auth.logout().subscribe({next:()=>this.router.navigate(['/']),error:()=>{this.auth.clearAuth();this.router.navigate(['/']);}});}
}
