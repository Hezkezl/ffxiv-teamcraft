import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AdditionPickerEntry } from './addition-picker-entry';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { LazyScrollComponent } from '../../lazy-scroll/lazy-scroll/lazy-scroll.component';
import { DialogComponent } from '../../../core/dialog.component';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';


@Component({
  selector: 'app-folder-addition-picker',
  templateUrl: './folder-addition-picker.component.html',
  styleUrls: ['./folder-addition-picker.component.less'],
  standalone: true,
  imports: [LazyScrollComponent, NzCheckboxModule, FormsModule, NzButtonModule, NzWaveModule, AsyncPipe, TranslateModule, NzEmptyComponent]
})
export class FolderAdditionPickerComponent extends DialogComponent implements OnInit {

  public elements: AdditionPickerEntry[] = [];

  private selected: AdditionPickerEntry[] = [];

  constructor(private modalRef: NzModalRef) {
    super();
  }

  ngOnInit(): void {
    this.patchData();
  }

  public setSelection(element: AdditionPickerEntry, selected: boolean): void {
    if (selected) {
      this.selected.push(element);
    } else {
      this.selected = this.selected.filter(e => e.$key !== element.$key);
    }
  }

  close(): void {
    this.modalRef.close(this.selected);
  }

}
