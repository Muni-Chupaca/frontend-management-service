import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {ListboxModule} from "primeng/listbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Authorizedvehicle} from "../../models/authorizedvehicle";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {ToastModule} from "primeng/toast";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ProgressSpinnerComponent} from "../progress-spinner/progress-spinner.component";
import {NgIf} from "@angular/common";
import {AutoCompleteComponent} from "../auto-complete/auto-complete.component";

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ListboxModule,
    ReactiveFormsModule,
    FormsModule,
    ToolbarComponent,
    ToastModule,
    AutoCompleteModule,
    ProgressSpinnerComponent,
    NgIf,
    AutoCompleteComponent
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  @Input() visible!: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchVehicleSelected: EventEmitter<Authorizedvehicle> = new EventEmitter<Authorizedvehicle>();

  constructor() {  }

  public onDialogHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
  public handleValueToToolbar($event: Authorizedvehicle): void {
    this.visible = false;
    this.searchVehicleSelected.emit($event);
  }
}
