import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-learn-home',
  imports: [RouterLink],
  templateUrl: './learn-home.html',
  styleUrl: './learn-home.css',
})
export class LearnHome {
  lessons = [
    { topic: 'C# Basics', slug: 'csharp', description: 'Introduction to C#' },
    { topic: 'OOP', slug: 'oop', description: 'Object-oriented programming' },
    { topic: 'Databases', slug: 'databases', description: 'SQL and ORM' },
  ];
}