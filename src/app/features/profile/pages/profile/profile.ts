import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../features/auth/services/auth.service';

@Component({ selector:'app-profile', imports:[], templateUrl:'./profile.html', styleUrl:'./profile.css' })
export class Profile {
  readonly auth=inject(AuthService);
  loading=false; error='';
  get user(){return this.auth.user;}
  refresh(){this.loading=true;this.error='';this.auth.getMe().subscribe({next:()=>this.loading=false,error:e=>{this.loading=false;this.error=e?.error?.detail||'Unable to load profile.';}});}
}
