import { Component } from '@angular/core';
@Component({
  selector: 'app-activity',
  imports: [],
  templateUrl: './activity.html',
  styleUrl: './activity.css',
})
export class Activity {
  activities = [
    ['Today', 'Created “C# OOP Interview Notes”'],
    ['Yesterday', 'Updated “SQL Window Functions”'],
    ['3 days ago', 'Favorited “Angular Signals”'],
    ['5 days ago', 'Published “Dependency Injection in .NET”'],
    ['1 week ago', 'Shared “EF Core Relationships”'],
  ];
}
