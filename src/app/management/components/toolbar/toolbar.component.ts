import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {SharedModule} from "primeng/api";
import {DialogComponent} from "../dialog/dialog.component";
import {ChipsModule} from "primeng/chips";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AutoCompleteModule} from "primeng/autocomplete";
import {InputIconModule} from "primeng/inputicon";
import {IconFieldModule} from "primeng/iconfield";
import {ToastModule} from "primeng/toast";
import {Authorizedvehicle} from "../../models/authorizedvehicle";
import {MainComponent} from "../../pages/main/main.component";
import {AuthService} from "../../services/auth.service";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ProgressSpinnerComponent} from "../progress-spinner/progress-spinner.component";
import {AutoCompleteComponent} from "../auto-complete/auto-complete.component";


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    ToolbarModule,
    SharedModule,
    DialogComponent,
    ChipsModule,
    FormsModule,
    NgIf,
    AutoCompleteModule,
    InputIconModule,
    IconFieldModule,
    ToastModule,
    MainComponent,
    ProgressSpinnerModule,
    ProgressSpinnerComponent,
    AutoCompleteComponent
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  dialogVisible: boolean = false;
  loading: boolean = false;
  @Output() authorizedVehicleSelected: EventEmitter<Authorizedvehicle> = new EventEmitter<Authorizedvehicle>();

  constructor(private authService: AuthService) {  }

  public ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((response: boolean): void => {
      this.isLoggedIn = response;
    });
  }

  public openDialog(): void {
    this.dialogVisible = true;
  }
  public hideDialog($event: boolean): void {
    this.dialogVisible = $event;
  }
  public handleValueToMain($event: Authorizedvehicle): void {
    this.authorizedVehicleSelected.emit($event);
  }
  public offSession(): void {
    this.loading = true;
    this.authService.signOut();
  }
}
