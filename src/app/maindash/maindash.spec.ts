import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maindash } from './maindash';

describe('Maindash', () => {
  let component: Maindash;
  let fixture: ComponentFixture<Maindash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maindash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Maindash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
