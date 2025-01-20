import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Validators, FormBuilder, FormsModule, AbstractControl } from '@angular/forms';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatError, MatFormFieldModule} from '@angular/material/form-field';
import {MAT_DATE_FORMATS, MatDateFormats, MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import * as bootstrap from 'bootstrap';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import dayjs from 'dayjs'
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-DD', // Expected input format
  },
  display: {
    dateInput: 'YYYY-MM-DD', // Displayed format
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-data',
  standalone: true,  // standalone-Komponente
  imports: [SharedModule, MatInputModule, MatFormFieldModule, MatError, MatCheckboxModule, FormsModule, MatIconModule, MatIcon,
     MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatButtonModule,   MatDialogModule,
     MatDialogActions,
     MatDialogClose,
     MatDialogContent,
   ],  // Import der benötigten Module
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css'],
  providers: [ { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class AddDataComponent implements OnInit {
  constructor(private formbuilder: FormBuilder, public storeService: StoreService, private backendService: BackendService) {
  }
  public registrationForm: any;
  public newsletter: boolean = false;



  ngOnInit(): void {
    this.registrationForm = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      courseId: ['', Validators.required],
      birthdate: [null, [Validators.required, this.above16Validator]],
      email: [null, [Validators.email]]
    })
    
  }

  above16Validator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = dayjs().subtract(16, "year").toDate();
    if (selectedDate > today) {
      return { minor: true };
    }
    return null;
  }

  onSubmit() {
    if(this.registrationForm.valid) {
      this.registrationForm.patchValue({birthdate: dayjs(this.registrationForm.get("birthdate").value).format("YYYY-MM-DD")})
      this.backendService.addRegistration(this.registrationForm.value, this.storeService.currentPage).subscribe(result =>
        {if(result){
          this.showToast();
        }
      }
      );
    }
  }

  showToast(){
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(document.getElementById('successToast') as HTMLElement);
    toastBootstrap.show();
  }
  
}


