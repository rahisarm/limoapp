import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectrecieptComponent } from './inspectreciept.component';

describe('InspectrecieptComponent', () => {
  let component: InspectrecieptComponent;
  let fixture: ComponentFixture<InspectrecieptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectrecieptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectrecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
