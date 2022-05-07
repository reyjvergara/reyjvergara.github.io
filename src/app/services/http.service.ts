import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../Models/Pokemon';
import { User } from '../Models/User';
import { lbSlot } from '../Models/lbSlot';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  http: HttpClient;

  constructor(http: HttpClient)
  {
    this.http = http;
  }
  getUserByUsername(usernameToTry: string): Observable<User>{
    return this.http.get<User>(`https://pokemonautochess.azurewebsites.net/api/Pokemon/GetUser/${usernameToTry}`);
  }
  usernameTaken(usernameToCheck: string): Observable<Boolean>{
    return this.http.get<boolean>(`https://pokemonautochess.azurewebsites.net/api/Pokemon/UsernameTaken/${usernameToCheck}`);
  }
  createUser(p: Partial<User>): Observable<any> {
    return this.http.post('https://pokemonautochess.azurewebsites.net/api/Pokemon/CreateUser', p);
  }

  matchResult(user: User, result: string): Observable<any>{
    return this.http.put(`https://pokemonautochess.azurewebsites.net/api/Pokemon/Match/${result}`, user);
  }

  createMatch(player: User, opponentId: number, result: string): Observable<any>{
    return this.http.post(`https://pokemonautochess.azurewebsites.net/api/Pokemon/Matches/${opponentId}/${result}`, player);
  }
  /*
  createUser(user: User): Observable<User> {
    let stringifiedUser: string = JSON.stringify(user);
    return this.http.post('https://pokemonautochess.azurewebsites.net/api/Pokemon/CreateUser/{stringifiedUser}', user);
  }
  */
  getRandomPokemon(): Observable<Pokemon> {
    return this.http.get<Pokemon>('https://pokemonautochess.azurewebsites.net/api/Pokemon/GetRandomPokemon');
  } 

  getLeaderboardWinRate(): Observable<lbSlot[]>{
    return this.http.get<lbSlot[]>('https://pokemonautochess.azurewebsites.net/api/Pokemon/GetLeaderboardWinRate');
  }
}
