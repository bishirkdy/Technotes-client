import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleBlock } from './example-block';

describe('ExampleBlock', () => {
  let component: ExampleBlock;
  let fixture: ComponentFixture<ExampleBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
