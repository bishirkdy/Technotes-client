import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteApiService } from '../../../notes/services/note-api.service';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { FavoriteService } from '../../services/favorite.service';

@Component({selector:'app-favorite-list',imports:[RouterLink],templateUrl:'./favorite-list.html',styleUrl:'./favorite-list.css'})
export class FavoriteList {
  private readonly api=inject(NoteApiService); readonly favorites=inject(FavoriteService);
  notes:NoteResponse[]=[];loading=true;error='';
  ngOnInit(){this.load();}
  load(){this.api.getPublicNotes().subscribe({next:notes=>{this.notes=notes.filter(n=>this.favorites.isFavorite(n.id));this.loading=false;},error:e=>{this.error=e?.error?.detail||'Unable to load favorites.';this.loading=false;}});}
  remove(id:string){this.favorites.toggle(id);this.notes=this.notes.filter(n=>n.id!==id);}
}
