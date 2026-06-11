import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienForm } from './bien-form';

describe('BienForm', () => {
  let component: BienForm;
  let fixture: ComponentFixture<BienForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BienForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
