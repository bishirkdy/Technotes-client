import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lesson',
  imports: [RouterLink],
  templateUrl: './lesson.html',
  styleUrl: './lesson.css',
})
export class Lesson {
  topic: any;
  lesson: any;
  index = 0;
  lessons: any[] = [];

  constructor(
    private route: ActivatedRoute
  ) {
    const topicSlug = route.snapshot.paramMap.get('topic') || 'csharp';
    const lessonSlug = route.snapshot.paramMap.get('lesson') || 'introduction';

    const topics = this.getTopics() as Record<string, any>;
    this.lessons = topics[topicSlug] || [];
    this.topic = this.lessons.find((l: any) => l.slug === lessonSlug) || this.lessons[0];
    this.index = this.topic ? this.lessons.findIndex((l: any) => l.slug === this.topic.slug) : 0;
  }

  get previous() {
    return this.index > 0 ? this.lessons[this.index - 1] : null;
  }

  get next() {
    return this.index < this.lessons.length - 1 ? this.lessons[this.index + 1] : null;
  }

  getTopics() {
    return {
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
      dotnet: {
        topic: '.NET',
        slug: 'dotnet',
        lessons: [
          { slug: 'introduction', title: 'Introduction' },
          { slug: 'webpack', title: 'Webpack configuration' },
        ],
      },
    };
  }
}