import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBlock } from './text-block';

describe('TextBlock', () => {
  let component: TextBlock;
  let fixture: ComponentFixture<TextBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(TextBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
