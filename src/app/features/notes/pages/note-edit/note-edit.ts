import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContentBlock } from '../../components/content-block/content-block';
import { NoteApiService } from '../../services/note-api.service';
import { NoteMapperService } from '../../services/note-mapper.service';
import { NoteCreateModel, NoteSectionModel } from '../../models/note-create.model';
import { ContentBlockModel } from '../../models/content-block.model';

@Component({ selector: 'app-note-edit', imports: [FormsModule, RouterLink, ContentBlock], templateUrl: './note-edit.html', styleUrl: './note-edit.css' })
export class NoteEdit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(NoteApiService);
  private readonly mapper = inject(NoteMapperService);
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  note: NoteCreateModel & { description: string } = { title: '', description: '', visibility: 1, folderId: null, categoryId: null, sections: [] };
  activeSectionId: number | null = null;
  loading = true;
  saving = false;
  error = '';

  ngOnInit(): void {
    if (!this.id) { this.error = 'Note ID is missing.'; this.loading = false; return; }
    this.api.getById(this.id).subscribe({
      next: note => { this.note = this.mapper.fromResponse(note); this.activeSectionId = this.note.sections[0]?.id ?? null; this.loading = false; },
      error: err => { this.error = err?.error?.detail || 'Unable to load note.'; this.loading = false; }
    });
  }

  get activeSection(): NoteSectionModel | null { return this.activeSectionId === null ? null : this.find(this.note.sections, this.activeSectionId); }
  flattenSections(sections: NoteSectionModel[], level = 0, prefix = ''): Array<{section: NoteSectionModel; level: number; number: string}> { return sections.flatMap((s, i) => { const number = prefix ? `${prefix}.${i + 1}` : `${i + 1}`; return [{section:s, level, number}, ...this.flattenSections(s.children, level + 1, number)]; }); }
  selectSection(id: number): void { this.activeSectionId = id; }
  setBlocks(id: number, blocks: ContentBlockModel[]): void { const s = this.find(this.note.sections, id); if (s) s.contents = blocks; }
  addSection(parentId: number | null = null): void { const target = parentId === null ? this.note.sections : this.find(this.note.sections, parentId)?.children; if (!target) return; const children = target as NoteSectionModel[]; const section = { id: Date.now()+Math.random()*1000, title:'New Section', sortOrder:children.length, children:[], contents:[] } as NoteSectionModel; children.push(section); this.activeSectionId=section.id; }
  removeSection(id:number):void { if(this.remove(this.note.sections,id)){this.normalize(this.note.sections); if(this.activeSectionId===id)this.activeSectionId=this.note.sections[0]?.id??null;} }
  save():void { this.error=''; if(!this.note.title.trim()){this.error='Title is required.';return;} if(!this.note.sections.length){this.error='Add at least one section.';return;} this.normalize(this.note.sections); this.saving=true; this.api.update(this.id,this.note).subscribe({next:r=>this.router.navigate(['/notes',r.id]),error:e=>{this.error=e?.error?.detail||'Unable to update note.';this.saving=false;}}); }
  delete():void { if(!confirm('Delete this note?')) return; this.api.delete(this.id).subscribe({next:()=>this.router.navigate(['/app/notes']),error:e=>this.error=e?.error?.detail||'Unable to delete note.'}); }
  private find(sections:NoteSectionModel[],id:number):NoteSectionModel|null{for(const s of sections){if(s.id===id)return s;const f=this.find(s.children,id);if(f)return f;}return null;}
  private remove(sections:NoteSectionModel[],id:number):boolean{const i=sections.findIndex(s=>s.id===id);if(i>=0){sections.splice(i,1);return true;}return sections.some(s=>this.remove(s.children,id));}
  private normalize(sections:NoteSectionModel[]):void{sections.forEach((s,i)=>{s.sortOrder=i;s.contents=s.contents.map((c,j)=>({...c,sortOrder:j}));this.normalize(s.children);});}
}
