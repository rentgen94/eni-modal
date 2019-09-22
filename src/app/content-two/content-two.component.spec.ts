import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTwoComponent } from './content-two.component';

describe('ContentTwoComponent', () => {
  let component: ContentTwoComponent;
  let fixture: ComponentFixture<ContentTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
