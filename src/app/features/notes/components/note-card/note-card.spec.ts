import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteCard } from './note-card';
import { NoteResponse } from '../../models/note-response.model';
import { testProviders } from '../../../../testing/test-providers';

describe('NoteCard', () => {
  let component: NoteCard;
  let fixture: ComponentFixture<NoteCard>;

  const note: NoteResponse = {
    id: 'note-1',
    title: 'Angular signals',
    status: 2,
    visibility: 3,
    userId: 'user-1',
    folderId: null,
    categoryId: null,
    sections: [
      {
        id: 'section-1',
        title: 'Overview',
        sortOrder: 1,
        children: [],
        contents: [
          {
            id: 'content-1',
            type: 1,
            sortOrder: 1,
            content: 'Signals keep state changes explicit.',
            data: null,
            metadata: null
          }
        ]
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteCard],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(NoteCard);
    component = fixture.componentInstance;
    component.note = note;
    fixture.detectChanges();
  });

  it('should render the note summary', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Angular signals');
    expect(text).toContain('Signals keep state changes explicit.');
    expect(text).toContain('Documentation');
    expect(text).not.toContain('Public');
  });

  it('should show visibility only in authoring views', () => {
    component.showVisibility = true;
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Public');
  });

  it('should emit the note id when delete is requested', () => {
    let deletedId = '';
    component.deleteRequested.subscribe(id => (deletedId = id));
    component.requestDelete();
    expect(deletedId).toBe('note-1');
  });
});
