# MultiSelectDropdown

A fully configurable, customizable, Angular 5+ multi-select dropdown

### Installation
```
$ npm install angular-tree-view
```

### Code
The code is on [Github](https://github.com/engineer-andrew/Angular-Multi-Select-Dropdown).

### Demo
Check out all of the demos on [Github Pages](https://engineer-andrew.github.io/Angular-Multi-Select-Dropdown/) (coming soon).

### Quick Notes
The intention of this component is to provide a fully customizable, fully contained way to have a multi-select dropdown included in your Angular application. I wrote it to meet my needs so there's probably a lot of stuff it doesn't do, or doesn't do well. Feel free to open an issue or fork it and make changes.

### Usage
The most straightforward usage is to include the module with `.forRoot()` specified to enable your module to use the included service. In order to be fully customizable, there are a ton of options you can specify. I hope to update them here over time, but for now you can check them out by viewing the source (it's in /src/app/multi-select-dropdown-component/multi-select-dropdown-component.ts) and try to figure out which is which.

You'll see in the source that you can specify a config object instead of providing the individual property values. Again, I hope to document that in the future.

I suppose that's it for now. This is a component I use often so hopefully I can find the time to come back here and update the documentation with some frequency.