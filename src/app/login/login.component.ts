import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { User } from '../Models/User';
import { NgForm } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  displayLoginOrRegister: boolean = true;
  displayLogin: boolean = false;
  displayRegister: boolean = false;
  displayLoggedIn: boolean = false;
  normalPikachuUrl: string = "https://i.imgur.com/4ee8yHS.png";
  happyPikachuUrl: string = "https://i.imgur.com/iPWsL9u.png";
  sadPikachuUrl: string = "https://i.imgur.com/i7KnTKH.png";
  imageUrl: string = "https://i.imgur.com/4ee8yHS.png";
  message: string = "Login if you have an accout or register if you want to join.";
  blueColor: string = "background-color: #2a75bb;";
  redColor: string = "background-color: rgb(192, 58, 58);";
  greenColor: string = "background-color: darkseagreen;";
  messageColor: string = "background-color: #2a75bb;";
  userToLogin: User = {
    id: 0,
    username: '',
    password: '',
    matches: 0,
    wins: 0,
    losses: 0
  }
  userToRegister: User = {
    id: 0,
    username: '',
    password: '',
    matches: 0,
    wins: 0,
    losses: 0
  }
  userToCheck: User = {
    id: 0,
    username: '',
    password: '',
    matches: 0,
    wins: 0,
    losses: 0
  }
  loggedInUser: User = {
    id: 0,
    username: '',
    password: '',
    matches: 0,
    wins: 0,
    losses: 0
  }
  @Output() notify = new EventEmitter<User>();

  constructor(private api : HttpService, private router: Router) { }

  passUserToGameBoard() {
    this.notify.emit(this.loggedInUser);
  }
  goToLogout(){
    this.displayLoginOrRegister = false;
    this.displayRegister = false;
  }
  goToLogin(){
    this.displayLoginOrRegister = false;
    this.displayLogin = true;
    this.displayRegister = false;
    this.imageUrl = this.normalPikachuUrl;

  }
  goToRegister(){
    this.displayLoginOrRegister = false;
    this.displayLogin = false;
    this.displayRegister = true;
    this.message = "Choose a username and password. Username and password must contain letters and numbers only and cannot be blank.";
    this.messageColor = this.blueColor;
    this.imageUrl = this.normalPikachuUrl;
  }
  goToLoginOrRegister(){
    this.displayLoginOrRegister = true;
    this.displayLogin = false;
    this.displayRegister = false;
    this.displayLoggedIn = false;
    this.message = "Login if you have an accout or register if you want to join.";
    this.imageUrl = this.normalPikachuUrl;
    this.messageColor = this.blueColor;
  }
  goToLoggedIn(){
    this.message = `You are playing as ${this.loggedInUser.username}.`;
    this.displayLoginOrRegister = false;
    this.displayLogin = false;
    this.displayRegister = false;
    this.displayLoggedIn = true;
    this.imageUrl = this.happyPikachuUrl;
    this.messageColor = this.greenColor;
  }
  clearFields(){
    this.userToLogin.username = "";
    this.userToLogin.password = "";
    this.userToCheck.username = "";
    this.userToCheck.password = "";
    this.userToRegister.username = "";
    this.userToRegister.password = "";
  }
  logout(){
    this.loggedInUser = {
      id: 0,
      username: '',
      password: '',
      matches: 0,
      wins: 0,
      losses: 0
    }
    this.api.getUserByUsername("Guest").subscribe(res => {
      this.loggedInUser = res;
      this.notify.emit(this.loggedInUser);
    });
    this.clearFields();
    this.goToLoginOrRegister();
  }
  
  tryToLogin(){
    if (
      /^[a-zA-Z0-9]+$/.test(this.userToLogin.username)
      && /^[a-zA-Z0-9]+$/.test(this.userToLogin.password)
    ) {
      this.api.getUserByUsername(this.userToLogin.username).subscribe(res => {
        this.userToCheck = res;
        if(!this.userToCheck) {
          this.message = `There is no account for ${this.userToLogin.username}. You can go back and register.`;
          this.imageUrl = this.sadPikachuUrl;
          this.messageColor = this.redColor;
          this.clearFields();
          
        }
        if(this.userToCheck.username == this.userToLogin.username && this.userToCheck.password == this.userToLogin.password ) {
          this.loggedInUser = this.userToCheck;
          this.notify.emit(this.loggedInUser);
          this.goToLoggedIn();
        } else {
          this.message = "Invalid credentials.";
          this.imageUrl = this.sadPikachuUrl;
          this.messageColor = this.redColor;
          this.clearFields();
          
        }
      });
    } else {
      this.message = "Username and password must contain letters and numbers only and cannot be blank.";
      this.clearFields();
      this.imageUrl = this.sadPikachuUrl;
      this.messageColor = this.redColor;
    }
  }
  tryToRegister(){
    // do an if statement calling to the api in checking if username is aleady taken
    /*
    this.api.usernameTaken(this.userToRegister.username).subscribe(res => {
      this.message = res.toString();
    })
    */
    if (
      /^[a-zA-Z0-9]+$/.test(this.userToRegister.username)
      && /^[a-zA-Z0-9]+$/.test(this.userToRegister.password)
    ) {
      this.api.usernameTaken(this.userToRegister.username).subscribe(res => {     
        if(res === true) {
        this.message = `The username ${this.userToRegister.username} is taken.`;
        this.clearFields();
        this.imageUrl = this.sadPikachuUrl;
        this.messageColor = this.redColor;
        } else {
          this.api.createUser(this.userToRegister).subscribe();
          this.message = `An account was created for ${this.userToRegister.username}`;
          this.clearFields();
          this.imageUrl = this.happyPikachuUrl;
          this.messageColor = this.greenColor;
        }
      });
    } else {
      this.message = "Username and password must contain letters and numbers only and cannot be blank.";
      this.clearFields();
      this.imageUrl = this.sadPikachuUrl;
      this.messageColor = this.redColor;
    }
  }

  ngOnInit(): void {
    
  }

}
