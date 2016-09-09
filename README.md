[![npm version](https://badge.fury.io/js/ng2-combosearch.svg)](https://badge.fury.io/js/ng2-combosearch)

# ComboSearchComponent
 @version 1.0.1
 @author: Flávio Silva
 @link: [https://github.com/fssolutions/ng2-combosearch](https://github.com/fssolutions/ng2-combosearch)

 ## Installation

 TypeDoc runs on angular 2 and is available as an NPM package. You can install ng2-combosearch
 in your project's directory as usual:

 ```bash
 $ npm install --save ng2-combosearch
 ```

Component combo search for Angular 2.
```
 <combo-search nameDescription="var string" [startFill]="[true|false|yes|no]" [modelList]="var [Array<any>]" [(cpModel)]="var [any]" (searchText)="onYourFunction($event)" (selectItem)="onYourFunction($event)">
   <template let-currentItem>
     <div><b>{{currentItem.Property1}}<b> - {{currentItem.Propery2}}</div>
   </template>
 </combo-search>
```

## Example
### Template (.html)
```
 <combo-search nameDescription="nameModelToShow" startFill="yes" [modelList]="modelList" (searchText)="onSearchText($event)" (selectItem)="onSelectItem($event)"></combo-search>

 <combo-search nameDescription="nameModelToShow" startFill="yes" [modelList]="modelList" (searchText)="onSearchText($event)" (selectItem)="onSelectItem($event)">
   <template let-myVar>
     <div><b>{{myVar.Id}}</b> - {{myVar.Name}}({{myVar.User}})</div>
   </template>
 </combo-search>
```
### TypeScript (.ts)
 Import ComboSearchComponent
```
 import { ComboSearchComponent } from 'ng2-combosearch';
```

#### Add in your directives
```
 directives: [ ComboSearchComponent ]
```

 Create var to bind
```
 private nameModelToShow: string;
 private modelList: any;
```

 Create function to receive data
```
 private searchText(value: string){};
 private onSelectItem(value: any){};
```

### Complete Code
```
 ...
 import { ComboSearchComponent } from 'ng2-combosearch';

 ...
 directives: [ ComboSearchComponent ]

 ...
 export class YourClass{
  private nameModelToShow: string = "Name";
  private modelList: Array<any> = [
      { Id: 1, Name: 'My Name', User: 'my.user', ImgProfile: '11652-589-5-689.png'},
      { Id: 2, Name: 'My Name', User: 'my.user', ImgProfile: '11652-589-5-195.png'}
  ];

  private onSearchText(value: string){
    console.info("Searching for: ", value);
    // Load new model, when your search on demand;
  };

  private onSelectItem(value: any){
    console.info("Selected Item: ", value);
  };
 }
```
## Contributing

Contributions are welcome and appreciated. You can find ng2-combosearch on GitHub, feel free to start
an issue or create a pull requests:<br>
[https://github.com/fssolutions/ng2-combosearch](https://github.com/fssolutions/ng2-combosearch)


## License

Copyright (c) 2016 Flávio Silva [fssolutions](http://www.flaviosilva.net).<br>
Licensed under the MIT License (MIT)
