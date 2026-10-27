import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNotes } from './my-notes';
import { testProviders } from '../../../../testing/test-providers';

describe('MyNotes', () => {
  let component: MyNotes;
  let fixture: ComponentFixture<MyNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyNotes],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(MyNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
