import { Component, OnInit } from '@angular/core';
import { DataComponent } from './data/data.component';
import { AddDataComponent } from './add-data/add-data.component';
import { CommonModule } from '@angular/common';
import { StoreService } from '../shared/store.service';
import { BackendService } from '../shared/backend.service';
import { MatButtonModule } from '@angular/material/button';
import {MatIcon, MatIconModule} from "@angular/material/icon";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DataComponent, AddDataComponent, MatButtonModule, CommonModule,     MatIcon,
    MatIconModule,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  public showForm = false;

  buttonClicked() {
    this.showForm = !this.showForm;
  }
}
