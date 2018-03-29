import { Component, Input, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { MultiSelectDropdownConfig, MultiSelectDropdownOption } from '../models';
import { MultiSelectDropdownService } from '../multi-select-dropdown-service/multi-select-dropdown.service';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styles: ['.multi-select-dropdown-container > label { width: 100%; }']
})
export class MultiSelectDropdownComponent implements AfterContentInit {
  @Input() addSelectAllOption;
  @Input() allowMultiple;
  @Input() buttonClasses: string[] = [];
  @Input() buttonIconClasses: string[];
  @Input() buttonTextStyles: any;
  @Input() buttonWrapperClasses: string[];
  @Input() checkedClasses: string[];
  @Input() containerClasses: string[];
  @Input() id: string | number;
  @Input() label: string;
  @Input() listClasses: string[] = [];
  @Input() optionClasses: string[];
  @Input() options: MultiSelectDropdownOption[] = [];
  @Input() selectAllByDefault: boolean;
  @Input() selectAllText: string;
  @Input() selectAllValue: string;
  @Input() uncheckedClasses: string[];

  @Input() config: MultiSelectDropdownConfig = {};

  @Output() allSelected: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();

  public buttonText: string;
  public isOpen = false;
  public selectAllOption: MultiSelectDropdownOption = <MultiSelectDropdownOption>{
    id: 'select-all',
    isSelected: false
  };

  constructor(private multiSelectDropdownService: MultiSelectDropdownService) {
  }

  ngAfterContentInit() {
    this.buildConfig();

    if (this.config.listClasses.filter((item) => typeof item === 'string' && item.indexOf('col') > -1).length === 0 &&
        this.config.buttonClasses.filter((item) => typeof item === 'string' && item.indexOf('col') > -1).length > 0) {
          this.config.listClasses.push(this.config.buttonClasses.filter((item) => typeof item === 'string' && item.indexOf('col') > -1)[0]);
    }

    if (!this.config.allowMultiple) {
      this.config.addSelectAllOption = false;
    }

    if (this.config.addSelectAllOption) {
      this.selectAllOption = {
        display: this.config.selectAllText,
        id: 'select-all',
        isSelected: this.config.selectAllByDefault,
        value: this.config.selectAllValue
      };

      if (this.config.selectAllByDefault) {
        this.options.forEach(o => o.isSelected = true);
      }
    }

    this.updateButtonText();

    this.multiSelectDropdownService.register(this);
  }

  buildConfig(): void {
    this.config.addSelectAllOption = (this.addSelectAllOption === null || this.addSelectAllOption === undefined) ?
      (this.config.addSelectAllOption === null || this.config.addSelectAllOption === undefined) ? false : this.config.addSelectAllOption : this.addSelectAllOption;

    this.config.allowMultiple = (this.allowMultiple === null || this.allowMultiple === undefined) ?
      (this.config.allowMultiple === null || this.config.allowMultiple === undefined) ? true : this.config.allowMultiple : this.allowMultiple;

    this.config.buttonClasses = (this.buttonClasses === null || this.buttonClasses === undefined || this.buttonClasses.length === 0) ?
      (this.config.buttonClasses === null || this.config.buttonClasses === undefined || this.config.buttonClasses.length === 0) ? ['btn', 'btn-default'] : this.config.buttonClasses : this.buttonClasses;

    this.config.buttonIconClasses = (this.buttonIconClasses === null || this.buttonIconClasses === undefined || this.buttonIconClasses.length === 0) ?
      (this.config.buttonIconClasses === null || this.config.buttonIconClasses === undefined || this.config.buttonIconClasses.length === 0) ? ['fa', 'fa-angle-down', 'align-self-center'] : this.config.buttonIconClasses : this.buttonIconClasses;

    this.config.buttonTextStyles = (this.buttonTextStyles === null || this.buttonTextStyles === undefined) ?
      (this.config.buttonTextStyles === null || this.config.buttonTextStyles === undefined) ? {'flex': 1} : this.config.buttonTextStyles : this.buttonTextStyles;

    this.config.buttonWrapperClasses = (this.buttonWrapperClasses === null || this.buttonWrapperClasses === undefined || this.buttonWrapperClasses.length === 0) ?
      (this.config.buttonWrapperClasses === null || this.config.buttonWrapperClasses === undefined || this.config.buttonWrapperClasses.length === 0) ? ['d-flex'] : this.config.buttonWrapperClasses : this.buttonWrapperClasses;

    this.config.checkedClasses = (this.checkedClasses === null || this.checkedClasses === undefined || this.checkedClasses.length === 0) ?
      (this.config.checkedClasses === null || this.config.checkedClasses === undefined || this.config.checkedClasses.length === 0) ? ['fa', 'fa-check-square-o'] : this.config.checkedClasses : this.checkedClasses;

    this.config.containerClasses = (this.containerClasses === null || this.containerClasses === undefined || this.containerClasses.length === 0) ?
      (this.config.containerClasses === null || this.config.containerClasses === undefined || this.config.containerClasses.length === 0) ? [] : this.config.containerClasses : this.containerClasses;

    this.config.listClasses = (this.listClasses === null || this.listClasses === undefined || this.listClasses.length === 0) ?
      (this.config.listClasses === null || this.config.listClasses === undefined || this.config.listClasses.length === 0) ? [] : this.config.listClasses : this.listClasses;

    this.config.optionClasses = (this.optionClasses === null || this.optionClasses === undefined || this.optionClasses.length === 0) ?
      (this.config.optionClasses === null || this.config.optionClasses === undefined || this.config.optionClasses.length === 0) ? ['multi-select-option'] : this.config.optionClasses : this.optionClasses;

    this.config.selectAllByDefault = (this.selectAllByDefault === null || this.selectAllByDefault === undefined) ?
      (this.config.selectAllByDefault === null || this.config.selectAllByDefault === undefined) ? false : this.config.selectAllByDefault : this.selectAllByDefault;

    this.config.selectAllText = (this.selectAllText === null || this.selectAllText === undefined) ?
      (this.config.selectAllText === null || this.config.selectAllText === undefined) ? '(Select All)' : this.config.selectAllText : this.selectAllText;

    this.config.selectAllValue = (this.selectAllValue === null || this.selectAllValue === undefined) ?
      (this.config.selectAllValue === null || this.config.selectAllValue === undefined) ? null : this.config.selectAllValue : this.selectAllValue;

    this.config.uncheckedClasses = (this.uncheckedClasses === null || this.uncheckedClasses === undefined || this.uncheckedClasses.length === 0) ?
      (this.config.uncheckedClasses === null || this.config.uncheckedClasses === undefined || this.config.uncheckedClasses.length === 0) ? ['fa', 'fa-square-o'] : this.config.uncheckedClasses : this.uncheckedClasses;
  }

  close(): void {
    this.isOpen = false;
  }

  select(id: number | string): void {
    const option = this.options.find(o => o.id === id);
    option.isSelected = !option.isSelected;

    if (this.config.addSelectAllOption) {
      const selectedOptions = this.options.filter(o => o.isSelected).length;
      if (selectedOptions === this.options.length) {
        this.selectAllOption.isSelected = true;
      } else {
        this.selectAllOption.isSelected = false;
      }
    }

    if (!this.config.allowMultiple) {
      this.isOpen = false;
      this.options.filter(o => o.id !== id).forEach(o => o.isSelected = false);
    }

    this.updateButtonText();

    this.selected.emit(option);
  }

  selectAll(): void {
    this.selectAllOption.isSelected = !this.selectAllOption.isSelected;
    this.options.forEach(o => o.isSelected = this.selectAllOption.isSelected);
    this.updateButtonText();
    this.allSelected.emit(this.selectAllOption);
  }

  toggle(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.multiSelectDropdownService.open(this);
    }
  }

  updateButtonText(): void {
    const selectedOptions = this.options.filter(o => o.isSelected);
    if (selectedOptions.length === 0) {
      this.buttonText = '';
      return;
    }

    if (selectedOptions.length === this.options.length) {
      this.buttonText = 'All';
      return;
    }

    this.buttonText = selectedOptions.length === 1 ? '' : `(${selectedOptions.length}) `;
    selectedOptions.forEach(o => this.buttonText += `${o.display}, `);
    this.buttonText = this.buttonText.substring(0, this.buttonText.length - 2);
  }
}
