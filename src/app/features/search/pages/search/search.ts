import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoteApiService } from '../../../../features/notes/services/note-api.service';
import { NoteResponse } from '../../../../features/notes/models/note-response.model';

@Component({ selector:'app-search', imports:[FormsModule,RouterLink], templateUrl:'./search.html', styleUrl:'./search.css' })
export class Search {
  private readonly api=inject(NoteApiService);
  query=''; results:NoteResponse[]=[]; loading=false; searched=false; error='';
  search(){const q=this.query.trim();this.error='';if(!q){this.results=[];this.searched=false;return;}this.loading=true;this.searched=true;this.api.search(q).subscribe({next:r=>{this.results=r;this.loading=false;},error:e=>{this.error=e?.error?.detail||'Search failed.';this.loading=false;}});}
  preview(n:NoteResponse){return this.firstText(n.sections)||'Open the note to read more.';}
  private firstText(sections:any[]):string{for(const s of sections??[]){for(const c of s.contents??[]){if(c.content)return c.content;}const x=this.firstText(s.children);if(x)return x;}return '';}
}
