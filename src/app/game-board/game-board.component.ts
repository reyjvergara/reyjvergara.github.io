import { Component, OnInit, EventEmitter, ɵAPP_ID_RANDOM_PROVIDER, Output, Input, Renderer2 } from '@angular/core';
import { Pokemon } from '../Models/Pokemon';
import { User } from '../Models/User';
import { HttpService } from '../services/http.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { lbSlot } from '../Models/lbSlot';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})

export class GameBoardComponent implements OnInit {

  http: HttpClient;
  lbc!: LeaderboardComponent;
  httpService: HttpService;
  selectPokemon: Pokemon[] = [];
  enemySelectPokemon: Pokemon[] = [];
  playerPokemon: Pokemon[] = [];
  enemyPokemon: Pokemon[] = [];
  playerHP: number[] = [10, 10];
  matchwinloss: number[] = [0, 0, 0];
  roundwinloss: number[] = [0, 0, 0];
  gameticks: number = 1;
  round: number = 1;
  gameStarted: boolean = false;
  gameEnded: boolean = false;
  combatLog: string[] = ["Game Started, Begin Logging"];
  showBoard: boolean = true;
  showCombatLog: boolean = false;
  showLoginRegister: boolean = false;
  showLeaderboard: boolean = false;
  renderer: Renderer2;
  loggedInUser: User = {
    id: 0,
    username: '',
    password: '',
    matches: 0,
    wins: 0,
    losses: 0
  }
  opponentUser: User = {
    id: 0,
    username: '',
    password: '',
    matches: 0,
    wins: 0,
    losses: 0
  }


  @Output()
  success: EventEmitter<Array<Pokemon>> = new EventEmitter<Array<Pokemon>>();

  constructor(http: HttpClient, httpService: HttpService, renderer: Renderer2) {
    this.http = http;
    this.httpService = httpService;
    this.renderer = renderer;
  }

  onNotify(passedUser: User): void {
    this.loggedInUser = passedUser;
  }

  public run() {
    this.startRound(this.playerPokemon, this.enemyPokemon);
  } // end run method

  public startGame() {
    document.getElementById("gameState")!.innerHTML = "<img src=https://fontmeme.com/permalink/220505/70fb415bdbbb1a96db669ccc54d98a5e.png alt=pokemon-font border=0>";
    //at the start of the game reset everything to 0
    this.playerHP = [10, 10];
    this.matchwinloss = [0, 0, 0];
    this.playerPokemon = [];
    this.enemyPokemon = [];
    this.getPokemon();
    this.gameStarted = false;
    this.gameEnded = false;
    this.round = 1;
    this.combatLog = ["Game Started, Begin Logging"]; 
  } // end startGame method

  public startRound(Attacker: Pokemon[], Defender: Pokemon[]) {
    this.addLog("Round: " + this.round);
    this.roundwinloss = [0, 0, 0];

    let aDex = Attacker;
    let dDex = Defender;
    this.shuffle(aDex);
    this.shuffle(dDex);

    for (let x = 0; x < Attacker.length; x++) {
      let aPokemon = aDex[x];
      let dPokemon = dDex[x];

      switch (this.startFight(aPokemon, dPokemon)) {
        case -1:
          this.playerHP[0]--;
          this.matchwinloss[2]++;
          this.roundwinloss[2]++;
          this.addLog("Player's "+ aPokemon.name +" was defeated by Opponent's " + dPokemon.name)
          break;
        case 0:
          this.matchwinloss[1]++;
          this.roundwinloss[1]++;
          // console.log("Player tied");
          this.addLog("Both the Player's  "+ aPokemon.name +" and " + dPokemon.name + " defeated each other simultaneously")
          break;
        case 1:
          this.playerHP[1]--;
          // console.log("Player won");
          this.matchwinloss[0]++;
          this.roundwinloss[0]++;
          this.addLog("Opponent's "+ dPokemon.name +" was defeated by Player's " + aPokemon.name)
          break;
        default:
          this.addLog("Both the Player's  "+ aPokemon.name +" and " + dPokemon.name + " got tired of Fighting")
          break;
      }
    }
    this.round++;
    if (this.playerHP[0] > 0 && this.playerHP[1] > 0) {
      this.getPokemon();
    } else {
      this.gameEnded = true;
      this.gameEnd();
      this.addLog("Game Ended, Logging Complete");
      //go to game end
    }
  } // end startRound method



  public gameEnd() {
    //checks player hp and if hp <= 0 that person loses
    if (this.playerHP[0] > this.playerHP[1] && this.playerHP[0] >= 0) {
      console.log("You Win!");
      document.getElementById("gameState")!.innerHTML = "<img src=https://fontmeme.com/permalink/220504/221c3193832d1bf645cfd16ef3a09885.png alt=pokemon-font border=0>";
      this.httpService.matchResult(this.loggedInUser, "won").subscribe(res =>{this.loggedInUser= res;});
      this.httpService.matchResult(this.opponentUser, "lost").subscribe(res =>{this.opponentUser= res;});
      this.httpService.createMatch(this.loggedInUser, this.opponentUser.id, "won").subscribe();
      this.httpService.createMatch(this.opponentUser, this.loggedInUser.id, "lost").subscribe();
    }
    if (this.playerHP[1] > this.playerHP[0] && this.playerHP[1] >= 0) {
      document.getElementById("gameState")!.innerHTML = "<img src=https://fontmeme.com/permalink/220504/83121f4f2771f5c158dd5dfc38e712a2.png alt=pokemon-font border=0>"; 
      this.httpService.matchResult(this.loggedInUser, "lost").subscribe(res =>{this.loggedInUser = res;});
      this.httpService.matchResult(this.opponentUser, "won").subscribe(res =>{this.opponentUser= res;});
      this.httpService.createMatch(this.loggedInUser, this.opponentUser.id, "lost").subscribe();
      this.httpService.createMatch(this.opponentUser, this.loggedInUser.id, "won").subscribe();
      console.log("You Lose..."); 
    }
    if (this.playerHP[0] < 1 && this.playerHP[1] < 1) {
      document.getElementById("gameState")!.innerHTML = "<img src=https://fontmeme.com/permalink/220504/a788a277818d6d985a749ed27ed5a0b6.png alt=pokemon-font border=0>"; 
      this.httpService.matchResult(this.loggedInUser, "tied").subscribe(res =>{this.loggedInUser = res;});
      this.httpService.matchResult(this.opponentUser, "tied").subscribe(res =>{this.opponentUser= res;});
      this.httpService.createMatch(this.loggedInUser, this.opponentUser.id, "tied").subscribe()
      this.httpService.createMatch(this.opponentUser, this.loggedInUser.id, "won").subscribe();
      console.log("You... tied?"); 
    }
  }

  public startFight(Attacker: Pokemon, Defender: Pokemon): number {
    let turn = 1;
    let result = 0;
    let aDamageBonus = this.damageBonus(Attacker, Defender);
    let dDamageBonus = this.damageBonus(Defender, Attacker);
    let aHP = Attacker.hp;
    let dHP = Defender.hp;
    this.addLog(Attacker.name + " and " + Defender.name + " are fighting");
    while (aHP > 0 && dHP > 0) {
      this.addLog("Turns: " + turn);
      //while both either are alive keep fighting
      let aDamage = this.damageCalc(Attacker.attack, aDamageBonus, Defender.defense)
      let dDamage = this.damageCalc(Defender.attack, dDamageBonus, Attacker.defense)
      aHP = aHP - dDamage;
      dHP = dHP - aDamage;
      this.addLog(Attacker.name + " did " + aDamage + " to " + Defender.name);
      this.addLog(Defender.name + " did " + dDamage + " to " + Attacker.name);
      // console.log(dDamage + "dealt to player");
      // console.log(aDamage + "dealt to enemy");
      turn++;
      // console.log(turn + "turn count");
      if (turn > 10) {
        // console.log("tied");
        return -5;
      }
    }
    if (aHP <= 0) {
      // this.addLog(Attacker.name + " has fainted.");
      // console.log(Attacker.name + "fainted");
      result--;
    }
    if (dHP <= 0) {
      // this.addLog(Attacker.name + " has fainted.");
      // console.log(Defender.name + "fainted");
      result++;
    }
    return result;
  }


  public damageBonus(Attacker: Pokemon, Defender: Pokemon): number {
    let bonus = 0;
    switch (Attacker.type1) {
      case "normal":
        if (Defender.type1 == "rock") { bonus = -1; }
        if (Defender.type1 == "ghost") { bonus = -5; }
        if (Defender.type1 == "steel") { bonus = -1; }
        break;
      case "fire":
        if (Defender.type1 == "fire") { bonus = -1; }
        if (Defender.type1 == "water") { bonus = -1; }
        if (Defender.type1 == "grass") { bonus = 1; }
        if (Defender.type1 == "ice") { bonus = 1; }
        if (Defender.type1 == "bug") { bonus = 1; }
        if (Defender.type1 == "rock") { bonus = -1; }
        if (Defender.type1 == "dragon") { bonus = -1; }
        if (Defender.type1 == "steel") { bonus = 1; }
        break;
      case "water":
        if (Defender.type1 == "fire") { bonus = 1; }
        if (Defender.type1 == "water") { bonus = -1; }
        if (Defender.type1 == "grass") { bonus = -1; }
        if (Defender.type1 == "ground") { bonus = 1; }
        if (Defender.type1 == "rock") { bonus = 1; }
        if (Defender.type1 == "dragon") { bonus = -1; }
        break;
      case "electric":
        if (Defender.type1 == "water") { bonus = 1; }
        if (Defender.type1 == "electric") { bonus = -1; }
        if (Defender.type1 == "grass") { bonus = -1; }
        if (Defender.type1 == "ground") { bonus = -5; }
        if (Defender.type1 == "flying") { bonus = 1; }
        if (Defender.type1 == "dragon") { bonus = -1; }
        break;
      case "grass":
        if (Defender.type1 == "fire") { bonus = -1; }
        if (Defender.type1 == "water") { bonus = 1; }
        if (Defender.type1 == "grass") { bonus = -1; }
        if (Defender.type1 == "poison") { bonus = -1; }
        if (Defender.type1 == "ground") { bonus = 1; }
        if (Defender.type1 == "flying") { bonus = -1; }
        if (Defender.type1 == "bug") { bonus = -1; }
        if (Defender.type1 == "rock") { bonus = 1; }
        if (Defender.type1 == "dragon") { bonus = -1; }
        if (Defender.type1 == "steel") { bonus = -1; }
        break;
      case "ice":
        if (Defender.type1 == "fire") { bonus = -1; }
        if (Defender.type1 == "water") { bonus = -1; }
        if (Defender.type1 == "grass") { bonus = 1; }
        if (Defender.type1 == "ice") { bonus = -1; }
        if (Defender.type1 == "ground") { bonus = 1; }
        if (Defender.type1 == "flying") { bonus = 1; }
        if (Defender.type1 == "dragon") { bonus = 1; }
        if (Defender.type1 == "normal") { bonus = -1; }
        break;
      case "fighting":
        if (Defender.type1 == "normal") { bonus = 1; }
        if (Defender.type1 == "ice") { bonus = 1; }
        if (Defender.type1 == "poison") { bonus = -1; }
        if (Defender.type1 == "flying") { bonus = -1; }
        if (Defender.type1 == "psychic") { bonus = -1; }
        if (Defender.type1 == "bug") { bonus = -1; }
        if (Defender.type1 == "rock") { bonus = 1; }
        if (Defender.type1 == "ghost") { bonus = -5; }
        if (Defender.type1 == "dark") { bonus = 1; }
        if (Defender.type1 == "steel") { bonus = 1; }
        if (Defender.type1 == "fairy") { bonus = -1; }
        break;
      case "poison":
        if (Defender.type1 == "grass") { bonus = 1; }
        if (Defender.type1 == "poison") { bonus = -1; }
        if (Defender.type1 == "ground") { bonus = -1; }
        if (Defender.type1 == "rock") { bonus = -1; }
        if (Defender.type1 == "ghost") { bonus = -1; }
        if (Defender.type1 == "steel") { bonus = -5; }
        if (Defender.type1 == "fairy") { bonus = 1; }
        break;
      case "ground":
        if (Defender.type1 == "fire") { bonus = 1; }
        if (Defender.type1 == "electric") { bonus = 1; }
        if (Defender.type1 == "grass") { bonus = -1; }
        if (Defender.type1 == "poison") { bonus = 1; }
        if (Defender.type1 == "flying") { bonus = -5; }
        if (Defender.type1 == "bug") { bonus = -1; }
        if (Defender.type1 == "rock") { bonus = 1; }
        if (Defender.type1 == "steel") { bonus = 1; }
        break;
      case "flying":
        if (Defender.type1 == "electric") { bonus = -1; }
        if (Defender.type1 == "grass") { bonus = 1; }
        if (Defender.type1 == "fighting") { bonus = 1; }
        if (Defender.type1 == "bug") { bonus = 1; }
        if (Defender.type1 == "rock") { bonus = -1; }
        if (Defender.type1 == "steel") { bonus = -1; }
        break;
      case "psychic":
        if (Defender.type1 == "fighting") { bonus = 1; }
        if (Defender.type1 == "poison") { bonus = 1; }
        if (Defender.type1 == "psychic") { bonus = -1; }
        if (Defender.type1 == "dark") { bonus = -5; }
        if (Defender.type1 == "steel") { bonus = -1; }
        break;
      case "bug":
        if (Defender.type1 == "fire") { bonus = -1; }
        if (Defender.type1 == "grass") { bonus = 1; }
        if (Defender.type1 == "fighting") { bonus = -1; }
        if (Defender.type1 == "poison") { bonus = -1; }
        if (Defender.type1 == "flying") { bonus = -1; }
        if (Defender.type1 == "psychic") { bonus = 1; }
        if (Defender.type1 == "ghost") { bonus = -1; }
        if (Defender.type1 == "dark") { bonus = 1; }
        if (Defender.type1 == "normal") { bonus = -1; }
        if (Defender.type1 == "steel") { bonus = -1; }
        break;
      case "rock":
        if (Defender.type1 == "fire") { bonus = 1; }
        if (Defender.type1 == "ice") { bonus = 1; }
        if (Defender.type1 == "fighting") { bonus = -1; }
        if (Defender.type1 == "ground") { bonus = -1; }
        if (Defender.type1 == "flying") { bonus = 1; }
        if (Defender.type1 == "bug") { bonus = 1; }
        if (Defender.type1 == "steel") { bonus = -1; }
        break;
      case "ghost":
        if (Defender.type1 == "normal") { bonus = -5; }
        if (Defender.type1 == "psychic") { bonus = 1; }
        if (Defender.type1 == "ghost") { bonus = 1; }
        if (Defender.type1 == "dark") { bonus = -1; }
        break;
      case "dragon":
        if (Defender.type1 == "dragon") { bonus = 1; }
        if (Defender.type1 == "steel") { bonus = -1; }
        if (Defender.type1 == "fairy") { bonus = -5; }
        break;
      case "dark":
        if (Defender.type1 == "fighting") { bonus = -1; }
        if (Defender.type1 == "psychic") { bonus = 1; }
        if (Defender.type1 == "ghost") { bonus = 1; }
        if (Defender.type1 == "dark") { bonus = -1; }
        if (Defender.type1 == "fairy") { bonus = -1; }
        break;
      case "steel":
        if (Defender.type1 == "fire") { bonus = -1; }
        if (Defender.type1 == "water") { bonus = -1; }
        if (Defender.type1 == "electric") { bonus = -1; }
        if (Defender.type1 == "ice") { bonus = 1; }
        if (Defender.type1 == "rock") { bonus = 1; }
        if (Defender.type1 == "steel") { bonus = -1; }
        if (Defender.type1 == "fairy") { bonus = 1; }
        break;
      case "fairy":
        if (Defender.type1 == "fire") { bonus = -1; }
        if (Defender.type1 == "fighting") { bonus = 1; }
        if (Defender.type1 == "poison") { bonus = -1; }
        if (Defender.type1 == "dragon") { bonus = 1; }
        if (Defender.type1 == "dark") { bonus = 1; }
        if (Defender.type1 == "steel") { bonus = -1; }
        break;
      default:
        break;
    }
    return bonus;
  }

  public damageCalc(attack: number, bonus: number, defense: number): number {
    let damage = 0;
    switch (bonus) {
      case -1:
        damage = attack * .5;
        break;
      case 0:
        damage = attack * 1;
        break;
      case 1:
        damage = attack * 2;
        break;
      default:
        damage = attack * 0;
        break;
    }
    return damage;
  }

  public getPokemon() {
    const btn = document.getElementById('ShufflePKM') as HTMLButtonElement | null; // to disable the shuffle button
    btn?.setAttribute('disabled', ''); //
    
    for (let i = 0; i < 5; i++) {
      this.httpService.getRandomPokemon().subscribe(res => { this.enemySelectPokemon[i] = res });
    }
    for (let i = 0; i < 5; i++) {
      if (i <= 3) {
        this.httpService.getRandomPokemon().subscribe(res => { this.selectPokemon[i] = res });

      }
      else if (i >= 4) {
        this.httpService.getRandomPokemon().subscribe(res => { this.selectPokemon[i] = res; btn?.removeAttribute('disabled') });
      }

    }
  }

  public addPokemon(pokemon: Pokemon) {
    if (!this.gameEnded) {
      this.playerPokemon.push(pokemon);
      this.enemyPokemon.push(this.enemySelectPokemon[Math.floor(Math.random() * 5)]);
      if(this.gameStarted == false){
        if (this.playerPokemon.length < 3) {
          this.getPokemon();
        } else {
          this.startRound(this.playerPokemon, this.enemyPokemon);
          this.gameStarted = true;
          document.getElementById("gameState")!.innerHTML = "";
        }
      } else {
        this.startRound(this.playerPokemon, this.enemyPokemon);
      }
    }
  }

  public shuffle(arrayToShuffle: Array<Pokemon>): any {
    let currentIndex = arrayToShuffle.length, randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [arrayToShuffle[currentIndex], arrayToShuffle[randomIndex]] = [
        arrayToShuffle[randomIndex], arrayToShuffle[currentIndex]];
    }
    return arrayToShuffle;
  } // end shuffle method

  public addLog(string: string) {
    this.combatLog.push(string);
  }
  public testLogin() {
    console.log(this.loggedInUser);
  }

  click(component: any): void
  {

  }

  ngOnInit() {
    this.getPokemon();
    this.httpService.getUserByUsername("Guest").subscribe(res => {
      this.loggedInUser = res;
    });
    this.httpService.getUserByUsername("bot").subscribe(res => {
      this.opponentUser = res;
    });
  }
}