import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FloatLabelModule} from "primeng/floatlabel";
import {PasswordModule} from "primeng/password";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {AuthService} from "../../services/auth.service";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {DividerModule} from "primeng/divider";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgIf} from "@angular/common";
import {CheckboxModule} from "primeng/checkbox";
import {ProgressSpinnerComponent} from "../../components/progress-spinner/progress-spinner.component";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    RouterLink,
    FloatLabelModule,
    PasswordModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    IconFieldModule,
    InputIconModule,
    DividerModule,
    ToastModule,
    ProgressSpinnerModule,
    NgIf,
    CheckboxModule,
    ProgressSpinnerComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  providers: [MessageService]
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  disabled: boolean = true;
  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService, private messageService: MessageService) {  }

  public checkFields(): void {
    this.disabled = !(this.username.length >= 8 && this.password.length >= 8);
  }
  public SignInAdmin(): void {
    this.loading = true;
    if (this.username.length >= 8 && this.password.length >= 8) {
      this.authService.signIn({ username: this.username, password: this.password }).subscribe({
        next: (response: any): void => {
          this.loading = false;
          this.authService.saveToken(response['Token']);
          this.router.navigate(['/main/vehicle-consult']).then((): void => {
            this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Iniciado sesión exitosamente'});
          });
        },
        error: (): void => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Credenciales no válidas'});
          this.loading = false;
        }
      });
    }
    else {
      this.messageService.add({severity:'error', summary:'Error', detail:'Usuario o contraseña invalido'});
      this.loading = false;
    }
  }
}
