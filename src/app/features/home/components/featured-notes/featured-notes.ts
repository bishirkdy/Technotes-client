import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteApiService } from '../../../notes/services/note-api.service';
import { NoteResponse } from '../../../notes/models/note-response.model';

@Component({selector:'app-featured-notes',imports:[RouterLink],templateUrl:'./featured-notes.html',styleUrl:'./featured-notes.css'})
export class FeaturedNotes {
  private readonly api=inject(NoteApiService);notes:NoteResponse[]=[];loading=true;
  ngOnInit(){this.api.getPublicNotes().subscribe({next:n=>{this.notes=n.slice(0,3);this.loading=false;},error:()=>this.loading=false});}
  preview(n:NoteResponse){for(const s of n.sections??[]){for(const c of s.contents??[]){if(c.content)return c.content;} }return 'Open the note to read the complete content.';}
}
