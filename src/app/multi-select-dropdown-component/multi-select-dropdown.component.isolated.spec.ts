import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MultiSelectDropdownComponent } from './multi-select-dropdown.component';
import { MultiSelectDropdownOption } from '../models/multi-select-dropdown-option.model';
import { MultiSelectDropdownService } from '../multi-select-dropdown-service/multi-select-dropdown.service';
import { MockMultiSelectDropdownService } from '../multi-select-dropdown-service/mock-multi-select-dropdown.service';
import { customMatchers } from '../../testing/custom-matchers';
import { EventEmitter } from '@angular/core';
import { MultiSelectDropdownConfig } from '../models';

describe('MultiSelectDropdownComponent', () => {
  let component: MultiSelectDropdownComponent;
  let fixture: ComponentFixture<MultiSelectDropdownComponent>;
  let updateButtonTextSpy: jasmine.Spy;
  let defaultOptions: MultiSelectDropdownOption[];
  let multiSelectDropdownService: MultiSelectDropdownService;

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

    multiSelectDropdownService = TestBed.get(MultiSelectDropdownService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectDropdownComponent);
    component = fixture.componentInstance;
    updateButtonTextSpy = spyOn(component, 'updateButtonText');
    fixture.detectChanges();

    defaultOptions = [
      { display: 'First Option', id: 1, isSelected: false, value: '[First].[Option]' },
      { display: 'Second Option', id: 2, isSelected: false, value: '[Second].[Option]' },
      { display: 'Third Option', id: 3, isSelected: false, value: '[Third].[Option]' }
    ];
  });

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  describe('should define a default value', () => {
    it('to hide the list of options', () => {
      // assert
      expect(component.isOpen).toBe(false);
    });
  });

  describe('during initialization', () => {
    beforeEach(() => {
      // arrange
      spyOn(component, 'buildConfig');
    });

    it('should apply the first col positioning class found on the button to the list when the list does not have a col positioning class', () => {
      // arrange
      component.config.listClasses = ['dropdown-list'];
      component.config.buttonClasses = ['col-1', 'col-12'];

      // act
      component.ngAfterContentInit();

      // assert
      expect(component.config.listClasses).toEqual(['dropdown-list', 'col-1']);
    });

    it('should not apply any new col positioning class to the list when the list already has a col positioning class', () => {
      // arrange
      component.config.listClasses = ['dropdown-list', 'col-9'];
      component.config.buttonClasses = ['col-1', 'col-12'];

      // act
      component.ngAfterContentInit();

      // assert
      expect(component.config.listClasses).toEqual(['dropdown-list', 'col-9']);
    });

    it('should reset all select all properties when multiple selections are not allowed', () => {
      // arrange
      component.config.addSelectAllOption = true;
      component.config.allowMultiple = false;

      // act
      component.ngAfterContentInit();

      // assert
      expect(component.selectAllOption).toEqual(<MultiSelectDropdownOption>{
        id: 'select-all',
        isSelected: false
      });
      expect(component.config.addSelectAllOption).toBe(false);
    });

    it('should build the select all option when the select all option is included and a value is provided', () => {
      // arrange
      component.config.addSelectAllOption = true;
      component.config.selectAllValue = 'select-all-value';

      // act
      component.ngAfterContentInit();

      // assert
      expect(component.selectAllOption).toEqual({
        display: '(Select All)',
        id: 'select-all',
        isSelected: false,
        value: 'select-all-value'
      });
    });

    it('should build the select all option when the select all option is included and custom text is provided', () => {
      // arrange
      component.config.addSelectAllOption = true;
      component.config.selectAllText = 'All';

      // act
      component.ngAfterContentInit();

      // assert
      expect(component.selectAllOption).toEqual({
        display: 'All',
        id: 'select-all',
        isSelected: false,
        value: null
      });
    });

    it('should build the select all option when the select all option is included and all options should be selected by default', () => {
      // arrange
      component.config.addSelectAllOption = true;
      component.options = [
        {display: 'First Option', id: 'first-option', isSelected: false, value: '[First].[Option]'},
        {display: 'Second Option', id: 'second-option', isSelected: false, value: '[Second].[Option]'},
        {display: 'Third Option', id: 'third-option', isSelected: false, value: '[Third].[Option]'}
      ];
      component.config.selectAllByDefault = true;

      // act
      component.ngAfterContentInit();

      // assert
      expect(component.selectAllOption).toEqual({
        display: '(Select All)',
        id: 'select-all',
        isSelected: true,
        value: null
      });
    });

    it('should select all options when the select all option is included and all options should be selected by default', () => {
      // arrange
      component.config.addSelectAllOption = true;
      component.options = [
        {display: 'First Option', id: 'first-option', isSelected: false, value: '[First].[Option]'},
        {display: 'Second Option', id: 'second-option', isSelected: false, value: '[Second].[Option]'},
        {display: 'Third Option', id: 'third-option', isSelected: false, value: '[Third].[Option]'}
      ];
      component.config.selectAllByDefault = true;

      // act
      component.ngAfterContentInit();

      // assert
      component.options.forEach(o => {
        expect(o.isSelected).toBe(true);
      });
    });

    it('should not select all options when the select all option is included, but all options should not be selected by default', () => {
      // arrange
      component.addSelectAllOption = true;
      component.options = [
        {display: 'First Option', id: 'first-option', isSelected: false, value: '[First].[Option]'},
        {display: 'Second Option', id: 'second-option', isSelected: false, value: '[Second].[Option]'},
        {display: 'Third Option', id: 'third-option', isSelected: false, value: '[Third].[Option]'}
      ];

      // act
      component.ngAfterContentInit();

      // assert
      component.options.forEach(o => {
        expect(o.isSelected).toBe(false);
      });
    });

    it('should not build the select all option when the select all option is not included', () => {
      // arrange
      component.addSelectAllOption = false;

      // act
      component.ngAfterContentInit();

      // assert
      expect(component.selectAllOption).toEqual(<MultiSelectDropdownOption>{
        id: 'select-all',
        isSelected: false
      });
    });

    it('should not select all options when the select all option is not included', () => {
      // arrange
      component.addSelectAllOption = false;
      component.options = [
        {display: 'First Option', id: 'first-option', isSelected: false, value: '[First].[Option]'},
        {display: 'Second Option', id: 'second-option', isSelected: false, value: '[Second].[Option]'},
        {display: 'Third Option', id: 'third-option', isSelected: false, value: '[Third].[Option]'}
      ];
      component.selectAllByDefault = true;

      // act
      component.ngAfterContentInit();

      // assert
      component.options.forEach(o => {
        expect(o.isSelected).toBe(false);
      });
    });

    it('should update the button text', () => {
      // arrange
      updateButtonTextSpy.calls.reset();

      // act
      component.ngAfterContentInit();

      // assert
      expect(updateButtonTextSpy).toHaveBeenCalledTimes(1);
    });

    it('should build the config object', () => {
      // act
      component.ngAfterContentInit();

      // assert
      expect(component.buildConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('buildConfig', () => {
    describe('should set the select all option', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          addSelectAllOption: false
        };
        component.addSelectAllOption = true;

        // act
        component.buildConfig();

        // assert
        expect(component.config.addSelectAllOption).toBe(true);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          addSelectAllOption: false
        };
        component.addSelectAllOption = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.addSelectAllOption).toBe(false);
      });

      it('to false when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.addSelectAllOption = undefined;

        // act
        component.buildConfig();
        // assert
        expect(component.config.addSelectAllOption).toBe(false);
      });
    });

    describe('should set the allow multiple option', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          allowMultiple: false
        };
        component.allowMultiple = true;

        // act
        component.buildConfig();

        // assert
        expect(component.config.allowMultiple).toBe(true);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          allowMultiple: false
        };
        component.allowMultiple = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.allowMultiple).toBe(false);
      });

      it('to true when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.allowMultiple = undefined;

        // act
        component.buildConfig();
        // assert
        expect(component.config.allowMultiple).toBe(true);
      });
    });

    describe('should set the button classes value', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          buttonClasses: ['config-class']
        };
        component.buttonClasses = ['xyz', 'abc'];

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonClasses).toEqual(['xyz', 'abc']);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          buttonClasses: ['config-class']
        };
        component.buttonClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonClasses).toEqual(['config-class']);
      });

      it('to an expected default value when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.buttonClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonClasses).toEqual(['btn', 'btn-default']);
      });
    });

    describe('should set the button icon classes value', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          buttonIconClasses: ['config-class']
        };
        component.buttonIconClasses = ['123', '789'];

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonIconClasses).toEqual(['123', '789']);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          buttonIconClasses: ['config-class']
        };
        component.buttonIconClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonIconClasses).toEqual(['config-class']);
      });

      it('to an expected default value when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.buttonIconClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonIconClasses).toEqual(['fa', 'fa-angle-down', 'align-self-center']);
      });
    });

    describe('should set the button text style value', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          buttonTextStyles: {'blah': 2}
        };
        component.buttonTextStyles = {'boo': 1};

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonTextStyles).toEqual({'boo': 1});
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          buttonTextStyles: {'blah': 2}
        };
        component.buttonTextStyles = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonTextStyles).toEqual({'blah': 2});
      });

      it('to an expected default value when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.buttonTextStyles = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonTextStyles).toEqual({'flex': 1});
      });
    });

    describe('should set the button wrapper classes value', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          buttonWrapperClasses: ['config-class']
        };
        component.buttonWrapperClasses = ['123', '789'];

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonWrapperClasses).toEqual(['123', '789']);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          buttonWrapperClasses: ['config-class']
        };
        component.buttonWrapperClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonWrapperClasses).toEqual(['config-class']);
      });

      it('to an expected default value when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.buttonWrapperClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.buttonWrapperClasses).toEqual(['d-flex']);
      });
    });

    describe('should set the selected option classes value', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          checkedClasses: ['config-class']
        };
        component.checkedClasses = ['123', '789'];

        // act
        component.buildConfig();

        // assert
        expect(component.config.checkedClasses).toEqual(['123', '789']);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          checkedClasses: ['config-class']
        };
        component.checkedClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.checkedClasses).toEqual(['config-class']);
      });

      it('to an expected default value when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.checkedClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.checkedClasses).toEqual(['fa', 'fa-check-square-o']);
      });
    });

    describe('should set the container classes value', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          containerClasses: ['config-class']
        };
        component.containerClasses = ['123', '789'];

        // act
        component.buildConfig();

        // assert
        expect(component.config.containerClasses).toEqual(['123', '789']);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          containerClasses: ['config-class']
        };
        component.containerClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.containerClasses).toEqual(['config-class']);
      });

      it('to an empty set when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.containerClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.containerClasses).toEqual([]);
      });
    });

    describe('should set the list classes value', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          listClasses: ['config-class']
        };
        component.listClasses = ['123', '789'];

        // act
        component.buildConfig();

        // assert
        expect(component.config.listClasses).toEqual(['123', '789']);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          listClasses: ['config-class']
        };
        component.listClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.listClasses).toEqual(['config-class']);
      });

      it('to an empty set when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.listClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.listClasses).toEqual([]);
      });
    });

    describe('should set the option classes value', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          optionClasses: ['config-class']
        };
        component.optionClasses = ['123', '789'];

        // act
        component.buildConfig();

        // assert
        expect(component.config.optionClasses).toEqual(['123', '789']);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          optionClasses: ['config-class']
        };
        component.optionClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.optionClasses).toEqual(['config-class']);
      });

      it('to an expected default value when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.optionClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.optionClasses).toEqual(['multi-select-option']);
      });
    });

    describe('should set the select all by default option', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          selectAllByDefault: false
        };
        component.selectAllByDefault = true;

        // act
        component.buildConfig();

        // assert
        expect(component.config.selectAllByDefault).toBe(true);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          selectAllByDefault: false
        };
        component.selectAllByDefault = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.selectAllByDefault).toBe(false);
      });

      it('to false when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.selectAllByDefault = undefined;

        // act
        component.buildConfig();
        // assert
        expect(component.config.selectAllByDefault).toBe(false);
      });
    });

    describe('should set the select all text', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          selectAllText: 'sturgeon'
        };
        component.selectAllText = 'trout';

        // act
        component.buildConfig();

        // assert
        expect(component.config.selectAllText).toEqual('trout');
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          selectAllText: 'sturgeon'
        };
        component.selectAllText = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.selectAllText).toBe('sturgeon');
      });

      it('to an expected default value when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.selectAllText = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.selectAllText).toBe('(Select All)');
      });
    });

    describe('should set the select all text', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          selectAllValue: 'sturgeon'
        };
        component.selectAllValue = 'trout';

        // act
        component.buildConfig();

        // assert
        expect(component.config.selectAllValue).toEqual('trout');
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          selectAllValue: 'sturgeon'
        };
        component.selectAllValue = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.selectAllValue).toBe('sturgeon');
      });

      it('to null when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.selectAllValue = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.selectAllValue).toBeNull();
      });
    });

    describe('should set the unselected option classes value', () => {
      it('to the value provided separately when there is a value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          uncheckedClasses: ['config-class']
        };
        component.uncheckedClasses = ['123', '789'];

        // act
        component.buildConfig();

        // assert
        expect(component.config.uncheckedClasses).toEqual(['123', '789']);
      });

      it('to the value provided on the config object when there is no value provided separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {
          uncheckedClasses: ['config-class']
        };
        component.uncheckedClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.uncheckedClasses).toEqual(['config-class']);
      });

      it('to an expected default value when there is no value provided on the config or separately', () => {
        // arrange
        component.config = <MultiSelectDropdownConfig> {};
        component.uncheckedClasses = undefined;

        // act
        component.buildConfig();

        // assert
        expect(component.config.uncheckedClasses).toEqual(['fa', 'fa-square-o']);
      });
    });
  });

  describe('close', () => {
    it('should hide the list of options', () => {
      // arrange
      component.isOpen = true;

      // act
      component.close();

      // assert
      expect(component.isOpen).toBe(false);
    });
  });

  describe('select', () => {
    beforeEach(() => {
      // arrange
      spyOn(component.selected, 'emit');
      component.options = defaultOptions;
      updateButtonTextSpy.calls.reset();
    });

    it('should select the option when the option was not previously selected', () => {
      // act
      component.select(3);

      // assert
      expect(component.options[0].isSelected).toBe(false);
      expect(component.options[1].isSelected).toBe(false);
      expect(component.options[2].isSelected).toBe(true);
    });

    it('should de-select the option when the option was previously selected', () => {
      // arrange
      component.options[0].isSelected = true;
      component.options[1].isSelected = true;
      component.options[2].isSelected = true;

      // act
      component.select(2);

      // assert
      expect(component.options[1].isSelected).toBe(false);
    });

    it('should emit the selected option', () => {
      // arrange
      const expectedArgument = Object.assign({}, defaultOptions[0]);
      expectedArgument.isSelected = true;

      // act
      component.select(1);

      // assert
      expect(component.selected.emit).toHaveBeenCalledTimes(1);
      expect(component.selected.emit).toHaveBeenCalledWith(expectedArgument);
    });

    it('should update the button text', () => {
      // act
      component.select(1);

      // assert
      expect(updateButtonTextSpy).toHaveBeenCalledTimes(1);
    });

    it('should update the select all option when the select all option is included and the selected option is the last option to be selected', () => {
      // arrange
      component.config.addSelectAllOption = true;
      component.selectAllOption = {
        display: '(Select All)',
        id: 'select-all',
        isSelected: false,
        value: 'Select-All'
      };
      component.options[0].isSelected = true;
      component.options[1].isSelected = true;

      // act
      component.select(3);

      // assert
      expect(component.selectAllOption.isSelected).toBe(true);
    });

    it('should update the select all option when all options are selected and an option is de-selected', () => {
      // arrange
      component.config.addSelectAllOption = true;
      component.selectAllOption = {
        display: '(Select All)',
        id: 'select-all',
        isSelected: true,
        value: 'Select-All'
      };
      component.options[0].isSelected = true;
      component.options[1].isSelected = true;
      component.options[2].isSelected = true;

      // act
      component.select(3);

      // assert
      expect(component.selectAllOption.isSelected).toBe(false);
    });

    it('should not update the select all option when the select all option is not included', () => {
      // arrange
      component.addSelectAllOption = false;
      component.selectAllOption = <MultiSelectDropdownOption>{
        id: 'select-all',
        isSelected: false
      };
      component.options[0].isSelected = true;
      component.options[1].isSelected = true;

      // act
      component.select(3);

      // assert
      expect(component.selectAllOption.isSelected).toBe(false);
    });

    it('should hide the list of options when multiple selections are not allowed', () => {
      // arrange
      component.isOpen = true;
      component.config.allowMultiple = false;

      // act
      component.select(3);

      // assert
      expect(component.isOpen).toBe(false);
    });

    it('should de-select all other options when multiple selections are not allowed', () => {
      // arrange
      component.config.allowMultiple = false;
      component.options[0].isSelected = true;
      component.options[2].isSelected = true;

      // act
      component.select(2);

      // assert
      expect(component.options[0].isSelected).toBe(false);
      expect(component.options[1].isSelected).toBe(true);
      expect(component.options[2].isSelected).toBe(false);
    });
  });

  describe('selectAll', () => {
    beforeEach(() => {
      component.addSelectAllOption = true;
      component.selectAllOption = {
        display: '(Select All)',
        id: 'select-all',
        isSelected: false,
        value: 'Select-All'
      };
      component.options = defaultOptions;
      updateButtonTextSpy.calls.reset();

      spyOn(component.allSelected, 'emit');
    });

    it('should select the select all option when the select all option is not selected', () => {
      // act
      component.selectAll();

      // assert
      expect(component.selectAllOption.isSelected).toBe(true);
    });

    it('should de-select the select all option when the select all option is selected', () => {
      // arrange
      component.selectAllOption.isSelected = true;

      // act
      component.selectAll();

      // assert
      expect(component.selectAllOption.isSelected).toBe(false);
    });

    it('should select all options when the select all option is selected', () => {
      // act
      component.selectAll();

      // assert
      component.options.forEach(o => {
        expect(o.isSelected).toBe(true);
      });
    });

    it('should de-select all options when the select all option is de-selected', () => {
      // arrange
      component.selectAllOption.isSelected = true;
      component.options.forEach(o => {
        o.isSelected = true;
      });

      // act
      component.selectAll();

      // assert
      component.options.forEach(o => {
        expect(o.isSelected).toBe(false);
      });
    });

    it('should emit the all selected option', () => {
      // arrange
      const expectedArgument = Object.assign({}, component.selectAllOption);
      expectedArgument.isSelected = true;

      // act
      component.selectAll();

      // assert
      expect(component.allSelected.emit).toHaveBeenCalledTimes(1);
      expect(component.allSelected.emit).toHaveBeenCalledWith(expectedArgument);
    });

    it('should update the button text', () => {
      // act
      component.selectAll();

      // assert
      expect(updateButtonTextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('toggle', () => {
    beforeEach(() => {
      // arrange
      spyOn(multiSelectDropdownService, 'open');
    });

    it('should display the list values when the list values were previously not displayed', () => {
      // arrange
      component.isOpen = false;

      // act
      component.toggle();

      // assert
      expect(component.isOpen).toBe(true);
    });

    it('should hide the list values when the list values were previously displayed', () => {
      // arrange
      component.isOpen = true;

      // act
      component.toggle();

      // assert
      expect(component.isOpen).toBe(false);
    });

    it('should notify the service that the list has been opened', () => {
      // arrange
      component.isOpen = false;

      // act
      component.toggle();

      // assert
      expect(multiSelectDropdownService.open).toHaveBeenCalledTimes(1);
    });

    it('should not notify the service that the list has been closed', () => {
      // arrange
      component.isOpen = true;

      // act
      component.toggle();

      // assert
      expect(multiSelectDropdownService.open).not.toHaveBeenCalled();
    });
  });
});

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

    component.options = [
      { display: 'First Option', id: 1, isSelected: true, value: '[First].[Option]' },
      { display: 'Second Option', id: 2, isSelected: false, value: '[Second].[Option]' },
      { display: 'Third Option', id: 3, isSelected: true, value: '[Third].[Option]' }
    ];

    fixture.detectChanges();
  });

  describe('updateButtonText', () => {
    it('should show the number of selected items in parentheses when more than one value is selected', () => {
      // act
      component.updateButtonText();

      // assert
      expect(component.buttonText.substring(0, 3)).toBe('(2)');
    });

    it('should show the selected values separated by commas when more than one value is selected', () => {
      // act
      component.updateButtonText();

      // assert
      expect(component.buttonText).toBe('(2) First Option, Third Option');
    });

    it('should show the selected value when only one value is selected', () => {
      // arrange
      component.options[0].isSelected = false;

      // act
      component.updateButtonText();

      // assert
      expect(component.buttonText).toBe('Third Option');
    });

    it('should show \'All\' when all options are selected', () => {
      // arrange
      component.options[1].isSelected = true;

      // act
      component.updateButtonText();

      // assert
      expect(component.buttonText).toBe('All');
    });

    it('should be blank when no values are selected', () => {
      // arrange
      component.options[0].isSelected = false;
      component.options[2].isSelected = false;

      // act
      component.updateButtonText();

      // assert
      expect(component.buttonText).toBe('');
    });
  });
});
