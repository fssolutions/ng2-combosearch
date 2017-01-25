import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComboSearchComponent } from './combo-search.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ ComboSearchComponent ],
    exports: [ ComboSearchComponent ],
})
export class Ng2ComboSearchModule { }
