import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-expand-button',
  standalone: true,
  imports: [
    NgIf,
    ButtonModule,
    NgStyle,
    NgClass
  ],
  templateUrl: './expand-button.component.html',
  styleUrl: './expand-button.component.css'
})
export class ExpandButtonComponent implements OnInit {
  isLoggedIn: boolean = false;
  isExpanded: boolean = false;
  hover: boolean = false;

  constructor(private router: Router, private authService: AuthService, private elRef: ElementRef) {  }

  public ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((response: boolean): void => {
      this.isLoggedIn = response;
    });
  }

  public toggleExpanded(event: MouseEvent): void {
    this.isExpanded = true;
    this.hover = true;
    event.stopPropagation();
  }
  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isExpanded = false;
      this.hover = false;
    }
  }
  public accessLogIn(): void {
    this.router.navigate(['/auth/log-in']).then(() => { console.log('Accessing log in'); });
  }
}
