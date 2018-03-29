import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MultiSelectDropdownComponent } from './multi-select-dropdown.component';
import { MultiSelectDropdownOption } from '../models/multi-select-dropdown-option.model';
import { MultiSelectDropdownService } from '../multi-select-dropdown-service/multi-select-dropdown.service';
import { MockMultiSelectDropdownService } from '../multi-select-dropdown-service/mock-multi-select-dropdown.service';
import { customMatchers } from '../../testing/custom-matchers';
import { EventEmitter } from '@angular/core';

describe('MultiSelectDropdownComponent', () => {
  let component: MultiSelectDropdownComponent;
  let fixture: ComponentFixture<MultiSelectDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectDropdownComponent ],
      providers: [
        {
          provide: MultiSelectDropdownService,
          useClass: MockMultiSelectDropdownService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectDropdownComponent);
    component = fixture.componentInstance;
    spyOn(component, 'updateButtonText');
    fixture.detectChanges();

    component.options = [
      { display: 'First Option', id: 1, isSelected: false, value: '[First].[Option]' },
      { display: 'Second Option', id: 2, isSelected: false, value: '[Second].[Option]' },
      { display: 'Third Option', id: 3, isSelected: false, value: '[Third].[Option]' }
    ];
  });

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('should invoke the toggle function when the button is clicked', () => {
    // arrange
    spyOn(component, 'toggle');
    const button = fixture.debugElement.query(By.css('button'));

    // act
    button.triggerEventHandler('click', null);

    // assert
    expect(component.toggle).toHaveBeenCalledTimes(1);
  });

  it('should display the non-breaking-space span when the button text is blank', () => {
    // arrange
    component.buttonText = '';
    fixture.detectChanges();

    // act
    const debugElements = fixture.debugElement.queryAll(By.css('button > div > span'));

    // assert
    expect(debugElements.length).toBe(1);
    expect(debugElements[0].nativeElement.innerHTML).toBe('&nbsp;');
  });

  it('should display the button text span when the button text is not blank', () => {
    // arrange
    component.buttonText = 'All';
    fixture.detectChanges();

    // act
    const debugElements = fixture.debugElement.queryAll(By.css('button > div > span'));

    // assert
    expect(debugElements.length).toBe(1);
    expect(debugElements[0].nativeElement.textContent).toBe('All');
  });

  it('should display the list when the list is supposed to be displayed', () => {
    // arrange
    component.isOpen = true;
    fixture.detectChanges();

    // assert
    const debugElement = fixture.debugElement.query(By.css('div.option-list'));

    // assert
    expect(debugElement).not.toBeNull();
  });

  it('should hide the list when the list is not supposed to be displayed', () => {
    // arrange
    component.isOpen = false;
    fixture.detectChanges();

    // assert
    const debugElement = fixture.debugElement.query(By.css('div.option-list'));

    // assert
    expect(debugElement).toBeNull();
  });

  it('should display the select all option when the select all option should be displayed', () => {
    // arrange
    component.isOpen = true;
    component.config.addSelectAllOption = true;
    component.selectAllOption = {
      display: '(Select All)',
      id: 'select-all',
      isSelected: true,
      value: 'Select-All'
    };
    fixture.detectChanges();

    // act
    const debugElements = fixture.debugElement.queryAll(By.css('div.option-list > div'));

    // assert
    expect(debugElements.length).toBe(4);
    expect(debugElements[0].nativeElement.textContent).toContain('(Select All)');
  });

  it('should invoke the selectAll function when the select all item is clicked', () => {
    // arrange
    component.config.addSelectAllOption = true;
    component.options = [
      {id: 1, display: 'First Option', isSelected: false, value: '[First].[Option]'},
      {id: 2, display: 'Second Option', isSelected: false, value: '[Second].[Option]'},
      {id: 3, display: 'Third Option', isSelected: false, value: '[Third].[Option]'},
    ];
    component.isOpen = true;
    spyOn(component, 'selectAll');
    spyOn(component, 'select');
    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(By.css('.option-list > div'));

    // act
    options[0].triggerEventHandler('click', null);

    // assert
    expect(component.selectAll).toHaveBeenCalledTimes(1);
    expect(component.select).not.toHaveBeenCalled();
  });

  it('should not display the select all option when the select all option should not be displayed', () => {
    // arrange
    component.isOpen = true;
    fixture.detectChanges();

    // act
    const debugElements = fixture.debugElement.queryAll(By.css('div.option-list > div'));

    // assert
    expect(debugElements.length).toBe(3);
    expect(debugElements[0].nativeElement.textContent).toContain('First Option');
  });

  it('should display the value of each option in the list', () => {
    // arrange
    component.options = [
      {id: 1, display: 'First Option', isSelected: false, value: '[First].[Option]'},
      {id: 2, display: 'Second Option', isSelected: false, value: '[Second].[Option]'},
      {id: 3, display: 'Third Option', isSelected: false, value: '[Third].[Option]'},
    ];
    component.isOpen = true;
    fixture.detectChanges();

    // act
    const options = fixture.debugElement.queryAll(By.css('.option-list > div'));

    // assert
    expect(options[0].nativeElement.textContent).toContain('First Option');
    expect(options[1].nativeElement.textContent).toContain('Second Option');
    expect(options[2].nativeElement.textContent).toContain('Third Option');
  });

  it('should invoke the select function when an item is clicked', () => {
    // arrange
    component.options = [
      {id: 1, display: 'First Option', isSelected: false, value: '[First].[Option]'},
      {id: 2, display: 'Second Option', isSelected: false, value: '[Second].[Option]'},
      {id: 3, display: 'Third Option', isSelected: false, value: '[Third].[Option]'},
    ];
    component.isOpen = true;
    spyOn(component, 'select');
    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(By.css('.option-list > div'));

    // act
    options.forEach(option => {
      option.triggerEventHandler('click', null);
    });

    // assert
    expect(component.select).toHaveBeenCalledTimes(3);
    expect(component.select)['toHaveBeenCalledWithAll']([[1], [2], [3]]);
  });
});
