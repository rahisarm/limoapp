import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericinputComponent } from './numericinput.component';

describe('NumericinputComponent', () => {
  let component: NumericinputComponent;
  let fixture: ComponentFixture<NumericinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumericinputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumericinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
