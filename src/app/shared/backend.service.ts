import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Course } from './Interfaces/Course';
import { Registration } from './Interfaces/Registration';
import { catchError, map, of, timestamp } from 'rxjs';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public getCourses() {
      this.http.get<Course[]>('http://localhost:5000/courses?_expand=eventLocation').subscribe(data => {
        StoreService.courses = data;
        this.storeService.cousesLoading = false;
      });
  }

  public getRegistrations(page: number) {

    const options = {
      observe: 'response' as const,
      transferCache: {
        includeHeaders: ['X-Total-Count']
      }
    };

    this.http.get<Registration[]>(`http://localhost:5000/registrations?_expand=course&_page=${page}&_limit=5`, options).subscribe(data => {
      this.storeService.registrations = data.body!;
      this.storeService.registrationTotalCount = Number(data.headers.get('X-Total-Count'));
      this.storeService.registrationsLoading = false;
    });
  }

  public deleteRegistration(registrationId: number){
    return this.http.delete(`http://localhost:5000/registrations/${registrationId}`);
  }

  public addRegistration(registration: any, page: number) {
    const times = dayjs().format('YYYY-MM-DD HH:mm').toString();
    return this.http.post('http://localhost:5000/registrations', {...registration, timeOfCreation: times}).pipe(
      map(() => {
        this.getRegistrations(page);
        return true;
      }),catchError(() => {return of(false)})
    )
  }
}
