import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteList } from './favorite-list';
import { testProviders } from '../../../../testing/test-providers';

describe('FavoriteList', () => {
  let component: FavoriteList;
  let fixture: ComponentFixture<FavoriteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteList],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
