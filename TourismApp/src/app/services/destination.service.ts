import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../data-types/user.data';
import { Destination } from '../data-types/destination.data';



@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  GET_DESTINATIONS_URL: string = `https://localhost:5000/destination/get_all`;



  constructor(private http: HttpClient) { }

  addDestination<Destination>(destination: any, image: File): Observable<any> {

    const ADD_DESTINATION_URL: string = `https://localhost:5000/destination/add`;


    const formData = new FormData();
    formData.append('destination', JSON.stringify(destination));
    formData.append('image', image);

    return this.http.post(
      ADD_DESTINATION_URL,
      formData
    ).pipe(
      
      catchError(this.handleError)
    );
  }


  getDestinations(): Observable<any> {

    return this.http.get<Destination[]>(this.GET_DESTINATIONS_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Unauthorized error");
        }
        return throwError(() => error)
      }))
  }



  updateDestination(destination: any, image: File) {

    const UPDATE_DESTINATION_URL: string = `https://localhost:5000/destination/update/${destination.id}`;

    const formData = new FormData();
    formData.append('destination', JSON.stringify(destination));
    formData.append('image', image);

    return this.http.put(
      UPDATE_DESTINATION_URL,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }



  deleteDestination(id: any): Observable<any> {

    const DELETE_DESTINATION_URL = `https://localhost:5000/destination/delete/${id}`;
    return this.http.delete(DELETE_DESTINATION_URL, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    )
  }


  // getDestinationById(id: any): Observable<any> {

  //   const GET_DEVICE_BY_ID_URL = `http://localhost:8089/device/get-destination-by-id/${id}`;
  //   return this.http.get<User>(GET_DEVICE_BY_ID_URL).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if (error.status === 401) {
  //         console.log("Unauthorized error");
  //       }
  //       return throwError(() => error)
  //     }))
  // }

  consumeSpots(destination_id: any, nr_spots: any): Observable<any> {

    const CONSUME_SPOTS_URL = `https://localhost:5000/destination/consume_spots/${destination_id}/${nr_spots}`;
    return this.http.post<Destination>(CONSUME_SPOTS_URL,{}).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Unauthorized error");
        }
        return throwError(() => error)
      }))
  }



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
