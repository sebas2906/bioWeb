import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadsComponent } from './downloads/downloads.component';
import { LoginGuard } from '../login.guard';

const routes: Routes = [
  { path: '', component: DownloadsComponent,canActivate:[LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadsRoutingModule { }
