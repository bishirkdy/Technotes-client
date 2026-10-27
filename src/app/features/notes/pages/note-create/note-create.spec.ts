import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCreate } from './note-create';
import { testProviders } from '../../../../testing/test-providers';

describe('NoteCreate', () => {
  let component: NoteCreate;
  let fixture: ComponentFixture<NoteCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteCreate],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(NoteCreate);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});