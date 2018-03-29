import { MultiSelectDropdownOption } from './multi-select-dropdown-option.model';

export interface MultiSelectDropdownConfig {
    addSelectAllOption?: boolean;
    allowMultiple?: boolean;
    buttonClasses?: string[];
    buttonIconClasses?: string[];
    buttonTextStyles?: object;
    buttonWrapperClasses?: string[];
    checkedClasses?: string[];
    containerClasses?: string[];
    id?: string | number;
    labelText?: string;
    listClasses?: string[];
    optionClasses?: string[];
    options?: MultiSelectDropdownOption[];
    selectAllByDefault?: boolean;
    selectAllText?: string;
    selectAllValue?: string;
    uncheckedClasses?: string[];
}
