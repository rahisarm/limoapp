import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChildComponent } from './delivery-child.component';

describe('DeliveryChildComponent', () => {
  let component: DeliveryChildComponent;
  let fixture: ComponentFixture<DeliveryChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryChildComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
