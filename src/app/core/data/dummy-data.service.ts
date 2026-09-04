import { Injectable } from '@angular/core';

export interface DummyNote {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  updated: string;
  views: number;
  likes: number;
  favorite: boolean;
  visibility: 'Public' | 'Shared' | 'Private';
  status: 'Published' | 'Draft';
  sections: { title: string; blocks: { type: string; data: any }[] }[];
}

export interface LearningTopic {
  slug: string;
  title: string;
  description: string;
  lessons: { slug: string; title: string; duration: string; completed: boolean }[];
}

@Injectable({ providedIn: 'root' })
export class DummyDataService {
  readonly categories = [
    { name: 'C#', count: 42, description: 'Modern C# language concepts and practical examples.' },
    { name: '.NET', count: 36, description: 'ASP.NET Core, EF Core, Web API and platform concepts.' },
    { name: 'SQL', count: 31, description: 'Queries, joins, window functions and database design.' },
    { name: 'Angular', count: 28, description: 'Components, routing, forms, signals and architecture.' },
    { name: 'React', count: 24, description: 'Components, hooks, state and modern React patterns.' },
    { name: 'JavaScript', count: 39, description: 'Core JavaScript concepts for frontend development.' }
  ];

  readonly notes: DummyNote[] = [
    {
      id: 1, title: 'Dependency Injection in .NET',
      description: 'A practical guide to dependency injection, lifetimes and service registration.',
      category: '.NET', tags: ['dotnet', 'dependency-injection', 'csharp'], author: 'Bishir',
      updated: '2 hours ago', views: 1240, likes: 86, favorite: true, visibility: 'Public', status: 'Published',
      sections: [
        { title: 'Introduction', blocks: [{ type: 'text', data: { content: 'Dependency Injection is a design technique where dependencies are provided to a class instead of created by the class.' } }, { type: 'definition', data: { term: 'Dependency Injection', definition: 'A technique for supplying an object with the dependencies it needs.', example: 'Injecting an ILogger into a service.' } }] },
        { title: 'Example', blocks: [{ type: 'code', data: { language: 'csharp', filename: 'Program.cs', code: 'builder.Services.AddScoped<IUserService, UserService>();' } }] }
      ]
    },
    {
      id: 2, title: 'SQL Window Functions',
      description: 'Understand ROW_NUMBER, RANK, DENSE_RANK, LAG and LEAD with examples.',
      category: 'SQL', tags: ['sql', 'window-functions', 'interview'], author: 'Bishir',
      updated: 'Yesterday', views: 2180, likes: 142, favorite: true, visibility: 'Public', status: 'Published',
      sections: [
        { title: 'Ranking Functions', blocks: [{ type: 'text', data: { content: 'Window functions calculate values across related rows without collapsing the result set.' } }, { type: 'code', data: { language: 'sql', filename: 'ranking.sql', code: 'SELECT *, DENSE_RANK() OVER (ORDER BY salary DESC) AS rank FROM Employees;' } }] }
      ]
    },
    {
      id: 3, title: 'Angular Signals',
      description: 'A concise introduction to signal-based reactive state in Angular.',
      category: 'Angular', tags: ['angular', 'signals', 'frontend'], author: 'Maya',
      updated: '3 days ago', views: 980, likes: 64, favorite: false, visibility: 'Public', status: 'Published',
      sections: [{ title: 'Signals', blocks: [{ type: 'definition', data: { term: 'Signal', definition: 'A reactive value that notifies consumers when its value changes.', example: 'const count = signal(0);' } }] }]
    },
    {
      id: 4, title: 'EF Core Relationships',
      description: 'One-to-one, one-to-many and many-to-many relationship mapping.',
      category: 'EF Core', tags: ['ef-core', 'database', 'dotnet'], author: 'Rahul',
      updated: '5 days ago', views: 760, likes: 48, favorite: false, visibility: 'Shared', status: 'Published',
      sections: [{ title: 'Relationships', blocks: [{ type: 'points', data: { points: ['One-to-one', 'One-to-many', 'Many-to-many'] } }] }]
    },
    {
      id: 5, title: 'C# OOP Interview Notes',
      description: 'Short revision notes for abstraction, encapsulation, inheritance and polymorphism.',
      category: 'C#', tags: ['csharp', 'oops', 'interview'], author: 'Bishir',
      updated: '1 week ago', views: 1530, likes: 109, favorite: true, visibility: 'Private', status: 'Draft',
      sections: [{ title: 'OOP', blocks: [{ type: 'points', data: { points: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'] } }] }]
    }
  ];

  readonly learning: LearningTopic[] = [
    { slug: 'csharp', title: 'C#', description: 'Learn C# from fundamentals to object-oriented programming.', lessons: [
      { slug: 'introduction', title: 'C# Introduction', duration: '8 min', completed: true },
      { slug: 'variables', title: 'Variables and Data Types', duration: '10 min', completed: true },
      { slug: 'conditions', title: 'Conditions', duration: '9 min', completed: false },
      { slug: 'loops', title: 'Loops', duration: '12 min', completed: false },
      { slug: 'methods', title: 'Methods', duration: '14 min', completed: false },
      { slug: 'classes', title: 'Classes and Objects', duration: '18 min', completed: false },
      { slug: 'inheritance', title: 'Inheritance', duration: '15 min', completed: false },
      { slug: 'polymorphism', title: 'Polymorphism', duration: '16 min', completed: false }
    ] },
    { slug: 'sql', title: 'SQL', description: 'Master SQL queries, joins, grouping and advanced functions.', lessons: [
      { slug: 'introduction', title: 'SQL Introduction', duration: '7 min', completed: true },
      { slug: 'select', title: 'SELECT Statement', duration: '8 min', completed: true },
      { slug: 'where', title: 'WHERE Clause', duration: '8 min', completed: false },
      { slug: 'joins', title: 'Joins', duration: '15 min', completed: false },
      { slug: 'group-by', title: 'GROUP BY', duration: '12 min', completed: false },
      { slug: 'window-functions', title: 'Window Functions', duration: '20 min', completed: false }
    ] },
    { slug: 'angular', title: 'Angular', description: 'Build modern Angular applications with components and reactive state.', lessons: [
      { slug: 'introduction', title: 'Angular Introduction', duration: '9 min', completed: true },
      { slug: 'components', title: 'Components', duration: '12 min', completed: false },
      { slug: 'templates', title: 'Templates', duration: '10 min', completed: false },
      { slug: 'routing', title: 'Routing', duration: '14 min', completed: false },
      { slug: 'forms', title: 'Forms', duration: '18 min', completed: false },
      { slug: 'signals', title: 'Signals', duration: '15 min', completed: false }
    ] }
  ];

  getNote(id: number): DummyNote | undefined { return this.notes.find(n => n.id === id); }
  getTopic(slug: string): LearningTopic | undefined { return this.learning.find(t => t.slug === slug); }
  getLesson(topicSlug: string, lessonSlug: string) {
    const topic = this.getTopic(topicSlug);
    return topic ? { topic, lesson: topic.lessons.find(l => l.slug === lessonSlug) } : undefined;
  }
  toggleFavorite(note: DummyNote): void { note.favorite = !note.favorite; }
}
