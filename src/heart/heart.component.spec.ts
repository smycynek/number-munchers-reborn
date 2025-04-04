import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { HeartComponent } from './heart.component';

describe('HeartComponent', () => {
  let component: HeartComponent;
  let componentRef: ComponentRef<HeartComponent>;
  let fixture: ComponentFixture<HeartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('value', '5');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist with a valid value', () => {
    expect(component).toBeTruthy();
    expect(component.value()).toEqual('5');
  });
});
