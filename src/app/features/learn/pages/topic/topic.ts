import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-topic',
  imports: [RouterLink],
  templateUrl: './topic.html',
  styleUrl: './topic.css',
})
export class Topic {
  topic: any;

  constructor(private route: ActivatedRoute) {
    const topicName = route.snapshot.paramMap.get('topic') || 'csharp';
    const topics: any = {
      csharp: {
        topic: 'C# Basics',
        slug: 'csharp',
        lessons: [
          { slug: 'introduction', title: 'Introduction' },
          { slug: 'variables', title: 'Variables' },
          { slug: 'data-types', title: 'Data Types' },
        ],
      },
      angular: {
        topic: 'Angular',
        slug: 'angular',
        lessons: [
          { slug: 'introduction', title: 'Introduction' },
          { slug: 'components', title: 'Components' },
        ],
      },
    };
    this.topic = topics[topicName] || topics['csharp'];
  }
}