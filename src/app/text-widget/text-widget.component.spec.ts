import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextWidgetComponent } from './text-widget.component';

describe('TextWidgetComponent', () => {
  let component: TextWidgetComponent;
  let fixture: ComponentFixture<TextWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
