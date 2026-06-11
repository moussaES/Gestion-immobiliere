import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienList } from './bien-list';

describe('BienList', () => {
  let component: BienList;
  let fixture: ComponentFixture<BienList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BienList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
