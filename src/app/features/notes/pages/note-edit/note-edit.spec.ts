import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteEdit } from './note-edit';
import { testProviders } from '../../../../testing/test-providers';

describe('NoteEdit', () => {
  let component: NoteEdit;
  let fixture: ComponentFixture<NoteEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteEdit],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(NoteEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
