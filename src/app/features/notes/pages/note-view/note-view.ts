import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';
@Component({selector:'app-note-view',imports:[RouterLink],templateUrl:'./note-view.html',styleUrl:'./note-view.css'}) export class NoteView { note:any; constructor(route:ActivatedRoute,public data:DummyDataService){const id=Number(route.snapshot.paramMap.get('id'));this.note=data.getNote(id)||data.notes[0];} }
