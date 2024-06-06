import { Routes } from '@angular/router';
import {MainComponent} from "./management/pages/main/main.component";
import {NotFoundComponent} from "./shared/pages/not-found/not-found.component";
import {SignInComponent} from "./management/pages/sign-in/sign-in.component";

export const routes: Routes = [
  { path: '', redirectTo: 'main/vehicle-consult', pathMatch: 'full' },
  { path: 'main/vehicle-consult', component: MainComponent },
  { path: 'auth/log-in', component: SignInComponent },
  { path: '**', component: NotFoundComponent }
];
