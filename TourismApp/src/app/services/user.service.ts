import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../data-types/user.data';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  GET_USERS_URL:string=`https://localhost:8080/user/get-users`;



  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {

    return this.http.get<User[]>(this.GET_USERS_URL).pipe(
      catchError((error: HttpErrorResponse)=>
      {
        if(error.status === 401) {
          console.log("Unauthorized error");
        }
        return throwError(()=>error)
      }))
  }

  updateUser(body: User) {
    
    const   UPDATE_USER_URL:string=`https://localhost:8080/user/update/${body.id}`;

    return this.http.put(UPDATE_USER_URL, body, {responseType: 'text'}).pipe(
      catchError(this.handleError)
    )
  }



  deleteUser(id: any): Observable<any> {

    const DELETE_USER_URL =`https://localhost:8080/user/delete/${id}`;
    return this.http.delete(DELETE_USER_URL,{responseType: 'text'}).pipe(
      catchError(this.handleError)
    )
  }

  
  getUserByUsername(userUsername: any): Observable<any> {

    const GET_USER_BY_USERNAME_URL =`https://localhost:8080/user/get-user-by-username/${userUsername}`;
    return this.http.get<User>(GET_USER_BY_USERNAME_URL).pipe(
      catchError((error: HttpErrorResponse)=>
      {
        if(error.status === 401) {
          console.log("Unauthorized error");
        }
        return throwError(()=>error)
      }))
  }

  
  getUserById(id: any): Observable<any> {

    const GET_USER_BY_ID_URL =`https://localhost:8080/user/get-user-by-id/${id}`;
    return this.http.get<User>(GET_USER_BY_ID_URL).pipe(
      catchError((error: HttpErrorResponse)=>
      {
        if(error.status === 401) {
          console.log("Unauthorized error");
        }
        return throwError(()=>error)
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
