import { Component } from '@angular/core';
import { Pokemon } from './Models/Pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PokeAC';

  allPokemon!: Array<Pokemon>;
}
