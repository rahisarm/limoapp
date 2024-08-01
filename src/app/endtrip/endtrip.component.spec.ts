import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndtripComponent } from './endtrip.component';

describe('EndtripComponent', () => {
  let component: EndtripComponent;
  let fixture: ComponentFixture<EndtripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndtripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndtripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
