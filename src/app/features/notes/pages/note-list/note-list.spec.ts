import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteList } from './note-list';
import { testProviders } from '../../../../testing/test-providers';

describe('NoteList', () => {
  let component: NoteList;
  let fixture: ComponentFixture<NoteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteList],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(NoteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
