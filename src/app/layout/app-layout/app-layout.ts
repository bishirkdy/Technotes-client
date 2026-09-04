import { Component } from '@angular/core';
import { Sidebar } from "../components/sidebar/sidebar";
import { Header } from "../components/header/header";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {}
