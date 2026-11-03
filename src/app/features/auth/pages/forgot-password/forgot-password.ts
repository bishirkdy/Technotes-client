import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthShell } from '../../../../shared/components/auth-shell/auth-shell';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, AuthShell],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {}
