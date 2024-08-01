import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemarkerComponent } from './imagemarker.component';

describe('ImagemarkerComponent', () => {
  let component: ImagemarkerComponent;
  let fixture: ComponentFixture<ImagemarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagemarkerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagemarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
