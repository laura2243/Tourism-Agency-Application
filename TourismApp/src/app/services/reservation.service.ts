import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../data-types/user.data';
import { Destination } from '../data-types/destination.data';
import { Reservation } from '../data-types/reservation.data';



@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  GET_RESERVATIONS_URL: string = `https://localhost:5000/reservation/get_all`;
 



  constructor(private http: HttpClient) { }

  addReservation<Reservation>(reservation: any): Observable<any> {

    const ADD_RESERVATION_URL: string = `https://localhost:5000/reservation/add`;


    return this.http.post<User>(ADD_RESERVATION_URL,reservation).pipe(
        catchError((error: HttpErrorResponse)=>
        {
          if(error.status === 401) {
            console.log("Unauthorized error");
          }
          return throwError(()=>error)
        }))
  }


  getReservations(): Observable<any> {

    return this.http.get<Reservation[]>(this.GET_RESERVATIONS_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Unauthorized error");
        }
        return throwError(() => error)
      }))
  }

  getReservationsByDestinationId(destination_id: any): Observable<any> {
    const GET_RESERVATIONS_BY_DESTINATION_ID_URL = `https://localhost:5000/reservation/get_by_destination_id/${destination_id}`;

    return this.http.get<Reservation[]>(GET_RESERVATIONS_BY_DESTINATION_ID_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Unauthorized error");
        }
        return throwError(() => error)
      }))
  }



//   updateDestination(destination: any, image: File) {

//     const UPDATE_DESTINATION_URL: string = `http://localhost:5000/destination/update/${destination.id}`;

//     const formData = new FormData();
//     formData.append('destination', JSON.stringify(destination));
//     formData.append('image', image);

//     return this.http.put(
//       UPDATE_DESTINATION_URL,
//       formData
//     ).pipe(
//       catchError(this.handleError)
//     );
//   }



//   deleteDestination(id: any): Observable<any> {

//     const DELETE_DESTINATION_URL = `http://localhost:5000/destination/delete/${id}`;
//     return this.http.delete(DELETE_DESTINATION_URL, { responseType: 'text' }).pipe(
//       catchError(this.handleError)
//     )
//   }


//   getDestinationById(id: any): Observable<any> {

//     const GET_DEVICE_BY_ID_URL = `http://localhost:8089/device/get-destination-by-id/${id}`;
//     return this.http.get<User>(GET_DEVICE_BY_ID_URL).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           console.log("Unauthorized error");
//         }
//         return throwError(() => error)
//       }))
//   }



  public handleError(error: HttpErrorResponse) {
    let errorMsg = '';

    if (error?.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`;
    } else {
      errorMsg = error.message;
    }

    return throwError(() => new Error(errorMsg));
  }
}
