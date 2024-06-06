import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {Authorizedvehicle} from "../../models/authorizedvehicle";
import {FormsModule} from "@angular/forms";
import {AuthorizedvehicleService} from "../../services/authorizedvehicle.service";
import {ProgressSpinnerComponent} from "../progress-spinner/progress-spinner.component";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    AutoCompleteModule,
    FormsModule,
    ProgressSpinnerComponent,
    NgIf
  ],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.css'
})
export class AutoCompleteComponent implements OnInit {
  searchSelected: Authorizedvehicle = {} as Authorizedvehicle;
  filteredPlates: string[] = [];
  plates: string[] = [];
  selectedPlate: string = '';
  loading: boolean = true;
  @Output() licensePlateSelected: EventEmitter<Authorizedvehicle> = new EventEmitter<Authorizedvehicle>();

  constructor(private authorizedVehicleService: AuthorizedvehicleService) { }

  public ngOnInit(): void {
    this.loadLicensePlates();
    this.authorizedVehicleService.plates$.subscribe((plates: string[]): void => {
      this.plates = plates;
      this.loading = false;
    });
  }

  private loadLicensePlates(): void {
    this.authorizedVehicleService.getAllLicensePlates().subscribe();
  }

  public onPlateSelectClick(): void {
    this.searchByLicensePlate();
  }
  public searchByLicensePlate(): void {
    if (this.selectedPlate) {
      this.authorizedVehicleService.getAuthorizedVehicleByLicensePlate(this.selectedPlate).subscribe((response: Authorizedvehicle): void => {
        this.searchSelected = response;
        this.licensePlateSelected.emit(this.searchSelected);
      });
    }
  }
  public filterPlate($event: AutoCompleteCompleteEvent): void {
    let filtered: string[] = [];
    let query: string = $event.query;

    for (let i: number = 0; i < (this.plates as string[]).length; i++) {
      let plate: string = (this.plates as string[])[i];
      if (plate.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(plate);
      }
    }
    this.filteredPlates = filtered;
  }
}
