import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentBlockToolbar } from './content-block-toolbar';

describe('ContentBlockToolbar', () => {
  let component: ContentBlockToolbar;
  let fixture: ComponentFixture<ContentBlockToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentBlockToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentBlockToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
