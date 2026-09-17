import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoteApiService } from '../../services/note-api.service';
import { NoteResponse } from '../../models/note-response.model';

@Component({ selector: 'app-note-list', imports: [RouterLink, FormsModule], templateUrl: './note-list.html', styleUrl: './note-list.css' })
export class NoteList {
  private readonly api = inject(NoteApiService);
  query = '';
  notes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void { this.load(); }
  load(): void { this.loading=true; this.api.getPublicNotes().subscribe({next:n=>{this.notes=n;this.loading=false;},error:e=>{console.error(e);this.error='Unable to load public notes.';this.loading=false;}}); }
  get filteredNotes(): NoteResponse[] { const q=this.query.trim().toLowerCase(); return q ? this.notes.filter(n=>n.title.toLowerCase().includes(q)) : this.notes; }
  preview(note: NoteResponse): string { return this.firstText(note.sections) || 'Open this note to read the complete content.'; }
  visibility(value:number): string { return value===1?'Public':value===2?'Shared':'Private'; }
  private firstText(sections:any[]):string { for(const s of sections??[]){for(const c of s.contents??[]){if(c.content)return c.content;}const nested=this.firstText(s.children);if(nested)return nested;}return ''; }
}
