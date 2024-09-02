import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskdialogComponent } from './taskdialog.component';

describe('TaskdialogComponent', () => {
  let component: TaskdialogComponent;
  let fixture: ComponentFixture<TaskdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskdialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
