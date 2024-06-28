import {Component, OnInit, ViewChild} from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {StyleClassModule} from "primeng/styleclass";
import {ButtonModule} from "primeng/button";
import {SpeedDialComponent} from "../../components/speed-dial/speed-dial.component";
import {AuthorizedvehicleService} from "../../services/authorizedvehicle.service";
import {Authorizedvehicle} from "../../models/authorizedvehicle";
import {ConfirmationService, MessageService} from "primeng/api";
import {CalendarModule} from "primeng/calendar";
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DatePipe, NgIf} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {DialogComponent} from "../../components/dialog/dialog.component";
import {FooterComponent} from "../../../shared/components/footer/footer.component";
import {ExpandButtonComponent} from "../../components/expand-button/expand-button.component";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {FileUploadModule} from "primeng/fileupload";
import {ProgressSpinnerComponent} from "../../components/progress-spinner/progress-spinner.component";
import {interval, Observable, Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    StyleClassModule,
    ButtonModule,
    SpeedDialComponent,
    CalendarModule,
    ToolbarComponent,
    ConfirmDialogModule,
    NgIf,
    ToastModule,
    DialogComponent,
    FooterComponent,
    ExpandButtonComponent,
    ProgressSpinnerModule,
    FileUploadModule,
    ProgressSpinnerComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  providers: [MessageService, ConfirmationService, DatePipe]
})
export class MainComponent implements OnInit {
  authorizedVehicle: Authorizedvehicle = new Authorizedvehicle();
  submitted: boolean = false;
  disabled: boolean = true;
  loading: boolean = false;
  originalLicensePlate: string = '';
  progress: number = 0;
  @ViewChild('fileInput') fileInput: any;

  constructor(private datePipe: DatePipe, private authService: AuthService, private authorizedvehicleService: AuthorizedvehicleService,
              private messageService: MessageService, private confirmationService: ConfirmationService) {  }

  public ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((response: boolean): void => {
      this.disabled = !response;
    });
  }

  private createAuthorizedVehicles(authorizedVehicle: Authorizedvehicle[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.authorizedvehicleService.createAll(authorizedVehicle).subscribe({
        next: (response: any) => {
          if (response) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (error: any) => {
          resolve(false);
          reject(error);
        }
      });
    });
  }
  private isDateFormat(dateString: string): boolean {
    const regex: RegExp = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateString);
  }
  private formatDates(): void {
    if (this.authorizedVehicle.issueDate && !this.isDateFormat(this.authorizedVehicle.issueDate)) {
      this.authorizedVehicle.issueDate = this.datePipe.transform(this.authorizedVehicle.issueDate, 'dd/MM/yyyy')!;
    }
    if (this.authorizedVehicle.expirationDate && !this.isDateFormat(this.authorizedVehicle.expirationDate)) {
      this.authorizedVehicle.expirationDate = this.datePipe.transform(this.authorizedVehicle.expirationDate, 'dd/MM/yyyy')!;
    }
  }
  private saveSuccess(): void {
    this.authorizedVehicle = new Authorizedvehicle();
    this.disabled = false;
    this.submitted = false;
  }
  private isValidForm(): boolean {
    return this.authorizedVehicle.licensePlate !== '' && this.authorizedVehicle.documentNumber !== ''
      && this.authorizedVehicle.issueDate !== null && this.authorizedVehicle.expirationDate !== null
      && this.authorizedVehicle.ownerName !== '' && this.authorizedVehicle.affiliatedCompany !== ''
      && this.authorizedVehicle.brand !== '' && this.authorizedVehicle.model !== ''
      && this.authorizedVehicle.status !== '' && this.authorizedVehicle.modality !== ''
      && this.authorizedVehicle.circulation !== '' && this.authorizedVehicle.route !== ''
      && this.authorizedVehicle.fleetNumber !== '' && this.authorizedVehicle.circulationCard !== '';
  }
  private existsLicensePlate(): Promise<boolean> {
    return new Promise<boolean>((resolve): void => {
      this.authorizedvehicleService.checkByLicensePlate(this.authorizedVehicle.licensePlate).subscribe((response: boolean): void => {
        if (response) {
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'La matrícula ya existe', key: 'bl' });
          resolve(true);
        }
        else {
          resolve(false);
        }
      });
    });
  }
  private validateFields(): boolean {
    const fieldsToValidate = [
      { name: 'Placa', value: this.authorizedVehicle.licensePlate, pattern: /.{6,8}/ },
      { name: 'Marca', value: this.authorizedVehicle.brand, pattern: /.{2,25}/ },
      { name: 'Modelo', value: this.authorizedVehicle.model, pattern: /.{2,25}/ },
      { name: 'Estado', value: this.authorizedVehicle.status, pattern: /.{2,50}/ },
      { name: 'Fecha de emisión', value: this.authorizedVehicle.issueDate, pattern: /^\d{2}\/\d{2}\/\d{4}$/ },
      { name: 'Número de flota', value: this.authorizedVehicle.fleetNumber, pattern: /.{2,25}/ },
      { name: 'Fecha de vencimiento', value: this.authorizedVehicle.expirationDate, pattern: /^\d{2}\/\d{2}\/\d{4}$/ },
      { name: 'Tarjeta de circulación', value: this.authorizedVehicle.circulationCard, pattern: /.{2,25}/ },
      { name: 'Modalidad', value: this.authorizedVehicle.modality, pattern: /.{2,50}/ },
      { name: 'Circulación', value: this.authorizedVehicle.circulation, pattern: /.{2,50}/ },
      { name: 'Ruta', value: this.authorizedVehicle.route, pattern: /.{2,50}/ },
      { name: 'Nombre y apellidos', value: this.authorizedVehicle.ownerName, pattern: /.{2,50}/ },
      { name: 'Número de documento', value: this.authorizedVehicle.documentNumber, pattern: /.{8}/ },
      { name: 'Compañia afiliada', value: this.authorizedVehicle.affiliatedCompany, pattern: /.{2,50}/ }
    ];
    for (const field of fieldsToValidate) {
      if (!field.pattern.test(field.value)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: `El campo ${ field.name.toUpperCase() } no cumple con el formato requerido`, key: 'bl' });
        return false;
      }
    }
    return true;
  }
  private async checkExistenceAndSave(): Promise<void> {
    const licensePlateExists: boolean = await this.existsLicensePlate();

    if (!licensePlateExists) {
      if (this.authorizedVehicle.id !== 0) {

        this.authorizedvehicleService.update(this.authorizedVehicle.id, this.authorizedVehicle).subscribe((): void => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Datos actualizados', key: 'bl' });
        });
      }
      else {
        this.authorizedvehicleService.create(this.authorizedVehicle).subscribe((): void => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Datos guardados', key: 'bl' });
        });
      }
      this.saveSuccess();
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La placa ya existe', key: 'bl' });
    }
  }

  public async handlePulseSave($event: boolean): Promise<void> {
    this.formatDates();
    if (this.isValidForm() && $event && this.validateFields()) {
      this.confirmationService.confirm({
        message: '¿Estás seguro en guardar los datos?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: "p-button-text",

        accept: (): void => {
          this.submitted = true;

          if (this.authorizedVehicle.id !== 0) {
            if (this.authorizedVehicle.licensePlate !== this.originalLicensePlate) {
              this.checkExistenceAndSave();
            }
            else {
              console.log(this.authorizedVehicle);
              this.authorizedvehicleService.update(this.authorizedVehicle.id, this.authorizedVehicle).subscribe((): void => {
                this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Datos actualizados', key: 'bl' });
              });
              this.saveSuccess();
            }
          }
          else {
            this.checkExistenceAndSave();
          }
        }
      });
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Complete todos los campos', key: 'bl' });
    }
  }
  public handleToggle($event: boolean): void {
    this.disabled = $event;
  }
  public handlePulseDelete($event: boolean): void {
    if (this.isValidForm() && $event) {
      this.confirmationService.confirm({
        message: '¿Estás seguro en eliminar los datos?',
        header: 'Eliminación',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: "p-button-danger p-button-text",
        rejectButtonStyleClass: "p-button-text p-button-text",
        acceptIcon: "none",
        rejectIcon: "none",

        accept: (): void => {
          if (this.authorizedVehicle.id !== 0) {
            this.authorizedvehicleService.delete(this.authorizedVehicle.id).subscribe((): void => {
              this.messageService.add({ severity: 'error', summary: 'Borrar', detail: 'Datos eliminados', key: 'bl' });
            });
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Borrar', detail: 'No hay datos para eliminar', key: 'bl' });
          }
          this.saveSuccess();
        }
      });
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Complete todos los campos', key: 'bl' });
    }
  }
  public handlePulseUpload($event: boolean): void {
    if ($event) {
      this.fileInput.nativeElement.click();
    }
  }
  public handlePulseEraser($event: boolean): void {
    if ($event) {
      this.authorizedVehicle = new Authorizedvehicle();
    }
  }

  public handleFileInput($event: any, fileInput: HTMLInputElement): void {
    this.loading = true;
    this.messageService.add({ severity: 'info', summary: 'Cargando datos', detail: 'Espere por favor', key: 'bl' });
    const selectedFile = $event.target.files[0];
    const authorizedVehicles: Authorizedvehicle[] = [];

    if (selectedFile) {
      const reader: FileReader = new FileReader();
      reader.onload = async (e: any): Promise<void> => {
        const data: Uint8Array = new Uint8Array(e.target.result);
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
        const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        for (const row of jsonData.slice(1)) {
          if (row.length > 1) {
            const authorizedVehicle: Authorizedvehicle = {
              id: 0,
              licensePlate: row[0]?.trim() || '',
              brand: row[1]?.trim() || '',
              model: row[2]?.trim() || '',
              status: row[3]?.trim() || '',
              modality: row[4]?.trim() || '',
              circulation: row[5]?.trim() || '',
              route: row[6]?.trim() || '',
              issueDate: row[7]?.trim() || '',
              expirationDate: row[8]?.trim() || '',
              fleetNumber: row[9].toString()?.trim() || '',
              circulationCard: row[10].toString()?.trim() || '',
              ownerName: row[11]?.trim() || '',
              documentNumber: row[12].toString()?.trim() || '',
              affiliatedCompany: row[13]?.trim() || ''
            };
            authorizedVehicles.push(authorizedVehicle);
          }
        }
        const intervalTime: Observable<number> = interval(500);
        const subscription: Subscription = intervalTime.subscribe((): void => {
          this.progress++;
          if (this.progress >= 99) {
            subscription.unsubscribe();
          }
        });
        const created: boolean = await this.createAuthorizedVehicles(authorizedVehicles);
        if (created) {
          this.progress = 0;
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Datos guardados', key: 'bl' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Existen datos duplicados', key: 'bl' });
        }
        this.loading = false;
        fileInput.value = '';
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }
  public handleValueReceived(value: Authorizedvehicle): void {
    this.authorizedVehicle = value;
    if (this.authorizedVehicle.id !== 0) {
      this.messageService.add({severity: 'success', summary: 'Datos cargados', detail: 'Búsqueda de datos exitosa', key: 'bl' });
      this.originalLicensePlate = this.authorizedVehicle.licensePlate;
    }
    else {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'No hay datos para cargar', key: 'bl' });
    }
  }
}
