import { Component, AfterViewInit, Input, Output, EventEmitter, ViewChild, ContentChild, ElementRef, TemplateRef } from '@angular/core';

/**
 * # ComboSearchComponent
 * @version 2.0
 * @author: Flávio Silva
 * @link: [https://github.com/fssolutions/ng2-combosearch](https://github.com/fssolutions/ng2-combosearch)
 *
 * Component combo search for Angular 2.
 *```
 * <combo-search nameDescription="var string" [startFill]="[true|false|yes|no]" [onDemand]="[true|false|yes|no]" [modelList]="var [Array<any>]" [(cpModel)]="var [any]" (searchText)="onYourFunction($event)" (selectItem)="onYourFunction($event)">
 *   <template let-currentItem>
 *     <div><b>{{currentItem.Property1}}</b> - {{currentItem.Propery2}}</div>
 *   </template>
 * </combo-search>
 *```
 *
 * ## Example
 * ### Template (.html)
 *```
 * <combo-search nameDescription="nameModelToShow" startFill="yes" [modelList]="modelList" (searchText)="onSearchText($event)" (selectItem)="onSelectItem($event)"></combo-search>
 *
 * <combo-search nameDescription="nameModelToShow" startFill="yes" [modelList]="modelList" (searchText)="onSearchText($event)" (selectItem)="onSelectItem($event)">
 *   <template let-myVar>
 *     <div><b>{{myVar.Id}}</b> - {{myVar.Name}}({{myVar.User}})</div>
 *   </template>
 * </combo-search>
 *```
 * ### TypeScript (.ts)
 * Import ComboSearchComponent
 *```
 * import { ComboSearchComponent } from 'ng2-combosearch';
 *```
 *
 * #### Add in your directives
 *```
 * directives: [ ComboSearchComponent ]
 *```
 *
 * Create var to bind
 *```
 * private nameModelToShow: string;
 * private modelList: any;
 *```
 *
 * Create function to receive data
 *```
 * private searchText(value: string){};
 * private onSelectItem(value: any){};
 *```
 *
 * ### Complete Code
 *```
 * ...
 * import { ComboSearchComponent } from 'ng2-combosearch';
 *
 * ...
 * directives: [ ComboSearchComponent ]
 *
 * ...
 * export class YourClass{
 *  private nameModelToShow: string = "Name";
 *  private modelList: Array<any> = [
 *      { Id: 1, Name: 'My Name', User: 'my.user', ImgProfile: '11652-589-5-689.png'},
 *      { Id: 2, Name: 'My Second Name', User: 'my.user', ImgProfile: '11652-589-5-195.png'}
 *  ];
 *
 *  private searchText(value: string){
 *    console.info("Searching for: ", value)
 *  };
 *
 *  private onSelectItem(value: any){
 *    console.info("Selected Item: ", value);
 *  };
 * }
 *```
 */
@Component({
    selector: 'combo-search',
    styleUrls: [
      './combo-search.component.css'
    ],
    templateUrl: './combo-search.component.html'
})
export class ComboSearchComponent implements AfterViewInit {
    private hasFocus: boolean = false;
    private lockFocus: boolean = true;
    private tout: number = 0;
    private toutHiddenList: number = 0;
    private itemSelect: any;
    private defauls = {
        startFill: false,
        onDemand: false
    };
    @ViewChild("searchInput") private searchInput: ElementRef;
    @ViewChild("listOption") private listOption: ElementRef;
    @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;

    public items: Array<any>;
    public itemsFilter: Array<any> = [];
    public itemSelected: any;

    @Input() nameDescription: string;
    @Input() placeHolder: string;
    @Input() disabled: boolean;
    @Input() required: any;
    @Input() id: string;
    @Input() name: string;
    @Input()
    set modelList(model: Array<any>) {
        if (this.items != null && this.items.length > 0)
            this.defauls.onDemand = true;

        this.items = model;
        this.itemsFilter = this.items;
        //this.ngAfterViewInit();
    }
    @Input()
    set startFill(value: any) {
        if (typeof value == 'string')
            value = value == 'yes';

        this.defauls.startFill = value;
    }
    @Input()
    set onDemand(value: any) {
        if (typeof value == 'string')
            value = value == 'yes';

        this.defauls.onDemand = value;
    }

    @Output() searchText = new EventEmitter<string>();
    @Output() selectItem = new EventEmitter<any>();

    @Input()
    set cpModel(model: any) {
        this.itemSelected = model;
        this.configBind();
    }
    @Output() cpModelChange: EventEmitter<any> = new EventEmitter();

    private manageCombo(text: string, event: KeyboardEvent) {
        let keyCode = event.keyCode || event.which;
        let textClean = this.purifyString(text);

        if (!![37, 38, 39, 40].filter(x => x == keyCode).length)
            return;

        if (this.defauls.onDemand) {
            this.itemsFilter = this.items;
        } else {
            let rx = new RegExp(text + "|" + textClean, "i");
            this.itemsFilter = this.items.filter(x => {
                return (x[this.nameDescription] && (rx.test(x[this.nameDescription]) || rx.test(this.purifyString(x[this.nameDescription]))));
            });
        }

        if (keyCode == 8)
            return;

        if (!!this.itemsFilter.length) {
            let firstItem = this.itemsFilter[0][this.nameDescription];
            let rx = new RegExp("^(" + text + '|' + textClean + ")", "i");

            if (rx.test(firstItem) || rx.test(this.purifyString(firstItem))) {
                this.searchInput.nativeElement.value = text + firstItem.substr(text.length);
                this.createSelection(this.searchInput.nativeElement, text.length, firstItem.length);
            }
        }

    }

    private manageList(text: string, event: KeyboardEvent) {
        let keyCode = event.keyCode || event.which;

        if (!![38, 40, 13].filter(x => x == keyCode).length)
            event.preventDefault();

        let i = this.itemsFilter.indexOf(this.itemSelect);

        if (keyCode == 38 && i - 1 >= 0) { //UP
            this.onSelect(this.itemsFilter[--i], false);
        } else if (keyCode == 40 && i < this.itemsFilter.length - 1) {
            this.onSelect(this.itemsFilter[++i], false);
        }

        if (this.listOption && this.listOption.nativeElement.children[i]) {
            let nt = this.listOption.nativeElement;
            let el = nt.children[i];

            if (keyCode == 38) { //UP
                nt.scrollTop = el.offsetTop;
            } else if (keyCode == 40) {
                nt.scrollTop = el.offsetTop + el.offsetHeight - nt.offsetHeight;
            }
        }

        if (keyCode == 9) {
            this.selectItemAuto(event, text);
        }
    }

    private hiddenList() {
        clearTimeout(this.toutHiddenList);
        this.toutHiddenList = window.setTimeout(() => {
            if (!this.lockFocus) {
                this.hasFocus = false;
                this.lockFocus = false;
            }
        }, 250);
    }

    private showList() {
        clearTimeout(this.toutHiddenList);
        this.hasFocus = true;
        this.lockFocus = false;

        window.setTimeout(() => {
            let i = this.itemsFilter.indexOf(this.itemSelect);
            if (i > -1)
                this.listOption.nativeElement.scrollTop = this.listOption.nativeElement.children[i].offsetTop;
        }, 0);
    }

    private createSelection(field: any, start: number, end: number) {
        if (field.createTextRange) {
            var selRange = field.createTextRange();
            selRange.collapse(true);
            selRange.moveStart('character', start);
            selRange.moveEnd('character', end);
            selRange.select();
        } else if (field.setSelectionRange) {
            field.setSelectionRange(start, end);
        } else if (field.selectionStart) {
            field.selectionStart = start;
            field.selectionEnd = end;
        }
        field.focus();
    }

    private configBind() {
        if (this.itemSelected != null) {
            //if (!this.defauls.onDemand)
                this.onSelect(this.itemSelected, false);

            this.defauls.startFill = true;
        }
    }

    private selectItemAuto(ev: KeyboardEvent, text: string) {
        let textclean = this.purifyString(text);
        let currentintenty = this.itemsFilter.filter(x => {
            return x[this.nameDescription].search(eval('/' + text + '|' + textclean + '/i')) > -1;
        })[0];
        this.onSelect(currentintenty || this.itemSelect);
        ev.preventDefault();
    }

    private purifyString(value: string) {
        let r: Array<any> = [];
        for (var i = 0, length = value.length; i < length; i++) {
            r.push(this.replaceCharacter(value.charAt(i)));
        }
        return r.join("");
    }

    private replaceCharacter(character: string) {
        switch (character) {
            case '\r': return "\r";
            case '\n': return "\n";
            case '\t': return "\t";
            case '\f': return "\r\n";
            case '\v': return "\r\n";
            case '`': return "'";
            case '€': return "_";
            case '‚': return ",";
            case 'ƒ': return "f";
            case '„': return "\"";
            case '…': return "...";
            case '†': return "_";
            case '‡': return "_";
            case 'ˆ': return "^";
            case '‰': return "%";
            case 'Š': return "S";
            case '‹': return "<";
            case 'Œ': return "CE";
            case 'Ž': return "Z";
            case '‘': return "'";
            case '’': return "'";
            case '“': return "\"";
            case '”': return "\"";
            case '•': return "-";
            case '–': return "-";
            case '—': return "-";
            case '˜': return "~";
            case '™': return "(tm)";
            case 'š': return "s";
            case '›': return ">";
            case 'œ': return "ce";
            case 'ž': return "z";
            case 'Ÿ': return "Y";
            case '¡': return "i";
            case '¥': return "Y";
            case '¦': return "|";
            case 'ª': return "a";
            case '¬': return "-";
            case '¯': return "-";
            case '²': return "2";
            case '³': return "3";
            case '´': return "'";
            case '¸': return ",";
            case '¹': return "1";
            case 'º': return "0";
            case '¼': return "1/4";
            case '½': return "1/2";
            case '¾': return "3/4";
            case '¿': return "?";
            case 'À': return "A";
            case 'Á': return "A";
            case 'Â': return "A";
            case 'Ã': return "A";
            case 'Ä': return "A";
            case 'Å': return "A";
            case 'Æ': return "AE";
            case 'Ç': return "C";
            case 'È': return "E";
            case 'É': return "E";
            case 'Ê': return "E";
            case 'Ë': return "E";
            case 'Ì': return "I";
            case 'Í': return "I";
            case 'Î': return "I";
            case 'Ï': return "I";
            case 'Ð': return "D";
            case 'Ñ': return "N";
            case 'Ò': return "O";
            case 'Ó': return "O";
            case 'Ô': return "O";
            case 'Õ': return "O";
            case 'Ö': return "O";
            case '×': return "x";
            case 'Ø': return "O";
            case 'Ù': return "U";
            case 'Ú': return "U";
            case 'Û': return "U";
            case 'Ü': return "U";
            case 'Ý': return "Y";
            case 'ß': return "B";
            case 'à': return "a";
            case 'á': return "a";
            case 'â': return "a";
            case 'ã': return "a";
            case 'ä': return "a";
            case 'å': return "a";
            case 'æ': return "ae";
            case 'ç': return "c";
            case 'è': return "e";
            case 'é': return "e";
            case 'ê': return "e";
            case 'ë': return "e";
            case 'ì': return "i";
            case 'í': return "i";
            case 'î': return "i";
            case 'ï': return "i";
            case 'ñ': return "n";
            case 'ò': return "o";
            case 'ó': return "o";
            case 'ô': return "o";
            case 'õ': return "o";
            case 'ö': return "o";
            case '÷': return "/";
            case 'ø': return "o";
            case 'ù': return "u";
            case 'ú': return "u";
            case 'û': return "u";
            case 'ü': return "u";
            case 'ý': return "y";
            case 'ÿ': return "y";
            case '©': return "(c)";
            case '®': return "(r)";
            default: return character;
        }
    }

    ngAfterViewInit() {
        this.configBind();

       // if (this.defauls.startFill) {
            this.itemsFilter = this.items;
       // }
    }

    search(text: string, event: KeyboardEvent) {
        let keyCode = event.keyCode || event.which;

        if (keyCode == 13) {
            event.preventDefault();
            this.selectItemAuto(event, text);
        } else {
            clearTimeout(this.tout);
            if (text.length == 0)
                this.itemsFilter = this.items;

            if ((keyCode > 46 && keyCode < 112) || keyCode == 8)
                this.tout = window.setTimeout(() => {
                    this.searchText.emit(text);
                    this.manageCombo(text, event);
                }, 350);
        }
    }

    onSelect(item: any, autoFire: boolean = true) {
        if (item == null)
            return;

        this.itemSelect = item;
        if (this.searchInput)
          if(this.nameDescription.indexOf("{") >= 0){
    				let pre_format = this.nameDescription.replace(/{([^}]+)}/g, "${item.$1}");
    				this.searchInput.nativeElement.value = eval("`"+pre_format+"`") || '';
    			}else
              this.searchInput.nativeElement.value = item[this.nameDescription] || '';

        if (autoFire) {
            this.selectItem.emit(item);
            this.itemSelected = item;
            this.cpModelChange.emit(item);

            this.lockFocus = false;
            this.hasFocus = false;

            if (this.searchInput)
                this.searchInput.nativeElement.blur();
        }
    }

}
