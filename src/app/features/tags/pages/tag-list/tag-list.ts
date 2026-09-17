import { Component } from '@angular/core';

@Component({
  selector: 'app-tag-list',
  imports: [],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.css',
})
export class TagList {
  tags = ['csharp', 'angular', 'dotnet', 'javascript', 'sql', 'python'];
}