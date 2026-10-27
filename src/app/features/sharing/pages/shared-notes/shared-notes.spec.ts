import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNotes } from './shared-notes';
import { testProviders } from '../../../../testing/test-providers';

describe('SharedNotes', () => {
  let component: SharedNotes;
  let fixture: ComponentFixture<SharedNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedNotes],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(SharedNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
