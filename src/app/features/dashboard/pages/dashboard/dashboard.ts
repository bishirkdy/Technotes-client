import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteApiService } from '../../../../features/notes/services/note-api.service';
import { NoteResponse } from '../../../../features/notes/models/note-response.model';

@Component({ selector:'app-dashboard', imports:[RouterLink], templateUrl:'./dashboard.html', styleUrl:'./dashboard.css' })
export class Dashboard {
  private readonly api=inject(NoteApiService);
  notes:NoteResponse[]=[]; loading=true; error='';
  ngOnInit(){this.api.getMyNotes().subscribe({next:n=>{this.notes=n;this.loading=false;},error:e=>{this.error=e?.error?.detail||'Unable to load dashboard.';this.loading=false;}});}
  get published(){return this.notes.filter(n=>n.status===2).length;}
  get drafts(){return this.notes.filter(n=>n.status!==2).length;}
}
