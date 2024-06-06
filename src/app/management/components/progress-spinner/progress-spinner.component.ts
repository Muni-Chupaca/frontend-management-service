import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-dark-overlay',
  standalone: true,
    imports: [
        NgIf,
        ProgressSpinnerModule
    ],
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.css'
})
export class ProgressSpinnerComponent {

  constructor() {  }
}
