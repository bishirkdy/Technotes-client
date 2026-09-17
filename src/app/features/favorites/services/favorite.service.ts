import { Injectable } from '@angular/core';

@Injectable({providedIn:'root'})
export class FavoriteService {
  private readonly key='technotes_favorites';
  private ids=new Set<string>(this.read());
  isFavorite(id:string):boolean{return this.ids.has(id);}
  toggle(id:string):boolean{if(this.ids.has(id))this.ids.delete(id);else this.ids.add(id);this.save();return this.ids.has(id);}
  all():string[]{return [...this.ids];}
  private read():string[]{if(typeof localStorage==='undefined')return[];try{return JSON.parse(localStorage.getItem(this.key)||'[]');}catch{return[];}}
  private save(){if(typeof localStorage!=='undefined')localStorage.setItem(this.key,JSON.stringify([...this.ids]));}
}
