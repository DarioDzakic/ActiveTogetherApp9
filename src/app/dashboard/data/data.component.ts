import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import { HeaderComponent } from "../../header/header.component";
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";
import * as bootstrap from 'bootstrap';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule, HeaderComponent, LoadingSpinnerComponent, MatIcon, MatIconModule, MatProgressSpinner, MatButtonModule],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {
loadingIndexContains(index: number): boolean {
  return this.loadingIndex.has(index);
}
  loadingIndex = new Set<number>();
  sortOrder: 'asc' | 'desc' = 'asc'; 

  abmelden(id: number, rowId: number) {
  this.loadingIndex.add(rowId);
  this.backendService.deleteRegistration(id).subscribe(result =>
    {
      if(result){
      this.showToast();
      this.loadingIndex.delete(rowId);
      }
    }
    );
    this.backendService.getRegistrations(this.page);
  }

  constructor(public storeService: StoreService, private backendService: BackendService) {}

  public page: number = 0;

  sortByTimeOfCreation(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.storeService.registrations.sort((a, b) => {
      const dateA = new Date(a.timeOfCreation).getTime();
      const dateB = new Date(b.timeOfCreation).getTime();

      if (this.sortOrder === 'asc') {
        return dateA - dateB; // Ascending order
      } else {
        return dateB - dateA; // Descending order
      }
    });
  }

  selectPage(i: any) {
    let currentPage = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(currentPage);
  }

  public returnAllPages() {
    var pagesCount = Math.ceil(this.storeService.registrationTotalCount / 5);
    let res = [];
    for (let i = 0; i < pagesCount; i++) {
        res.push(i + 1);
      }
    return res;
  }

    showToast(){
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(document.getElementById('successToast') as HTMLElement);
      toastBootstrap.show();
    }

}
