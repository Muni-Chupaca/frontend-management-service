import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToastModule} from "primeng/toast";
import {SpeedDialModule} from "primeng/speeddial";
import {MenuItem} from "primeng/api";
import {NgIf, NgStyle} from "@angular/common";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-speed-dial',
  standalone: true,
  imports: [
    ToastModule,
    SpeedDialModule,
    NgIf,
    NgStyle
  ],
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.css',
})
export class SpeedDialComponent implements OnInit {
  items: MenuItem[] = [];
  isLoggedIn: boolean = false;
  blurActive: boolean = false;
  @Output() toggleDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pulseSave: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pulseDelete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pulseUpload: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pulseEraser: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {  }

  public ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((response: boolean): void => {
      this.isLoggedIn = response;
    });
    this.items = [
      {
        icon: 'pi pi-save',
        command: (): void => {
          this.pulseSave.emit(true);
        }
      },
      {
        icon: 'pi pi-trash',
        command: (): void => {
          this.pulseDelete.emit(true);
        }
      },
      {
        icon: 'pi pi-upload',
        command: (): void => {
          this.pulseUpload.emit(true);
        }
      },
      {
        icon: 'pi pi-eraser',
        command: (): void => {
          this.pulseEraser.emit(true);
        }
      }
    ];
  }

  public onBlur(): void {
    this.blurActive = true;
  }
  public offBlur(): void {
    this.blurActive = false;
  }
}
