import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteApiService } from '../../../notes/services/note-api.service';
import { NoteResponse } from '../../../notes/models/note-response.model';

@Component({selector:'app-recent-notes',imports:[RouterLink],templateUrl:'./recent-notes.html',styleUrl:'./recent-notes.css'})
export class RecentNotes {private readonly api=inject(NoteApiService);notes:NoteResponse[]=[];ngOnInit(){this.api.getPublicNotes().subscribe({next:n=>this.notes=n.slice(0,5),error:()=>this.notes=[]});}preview(n:NoteResponse){for(const s of n.sections??[]){for(const c of s.contents??[]){if(c.content)return c.content;}}return 'Recently published note.';}}
