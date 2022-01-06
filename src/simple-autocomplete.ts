import {html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import "./results-list.js";

function changeHighlighted(arr: any[], dir: string) {
  if (arr.length <= 1 ) return arr;
  let highlightedIdx: number;
  let result = dir === 'Up'? arr.reverse() : arr;
  result = result.map((itm, idx ) => {
        if (itm.highlighted) {highlightedIdx = idx;}
        
        if (idx === highlightedIdx + 1 || highlightedIdx == arr.length - 1) return {...itm, highlighted: true};
        return {...itm, highlighted: false};
  })
  return dir === 'Up' ? result.reverse() : result;  
}
function filterByText(arr: any[], term: string) {
  return arr.filter(({text}) => term && text.includes(term));
}
function highlightFirst(arr: any[]){
  return arr.map((itm, idx) => ({text: itm.text, highlighted: !idx}))
}
@customElement('simple-autocomplete')
export class SimpleAutocomplete extends LitElement {

  constructor() {
    super();
    document.addEventListener('click', this._handleOutsideClick);
  }

  @query('input', true) _input!: HTMLInputElement;

  @property()
   term = '';
  
  @property({attribute: false})
  listItems: any[] = [];
  
  @property({attribute: false})
  filteredItems: any[] = [];

  @property({type: Array})
  set data(value: any[]) {
    // mimic data
    console.log('====');
    const data = ["Abomination","Abusive Sergeant","Acidic Swamp Ooze","Acidmaw","Acolyte of Pain","Al`Akir the Windlord","Alarm-o-Bot","Aldor Peacekeeper","Alexstrasza","Alexstrasza`s Champion","Amani Berserker","Ancestor`s Call","Ancestral Healing","Ancestral Knowledge","Ancestral Spirit","Ancient Brewmaster","Ancient Mage","Ancient of Lore","Ancient of War","Ancient Shade","Ancient Watcher","Angry Chicken","Anima Golem","Animal Companion","Animated Armor","Annoy-o-Tron","Anodized Robo Cub","Antique Healbot","Anub`ar Ambusher","Anub`arak","Anubisath Sentinel","Anyfin Can Happen","Arathi Weaponsmith","Arcane Blast","Arcane Explosion","Arcane Golem","Arcane Intellect","Arcane Missiles","Arcane Nullifier X-21","Argent Commander","Argent Horserider","Argent Lance","Argent Protector","Argent Squire","Argent Watchman","Armored Warhorse","Armorsmith","Assassin`s Blade","Assassinate","Azure Drake","Backstab","Ball of Spiders","Bane of Doom","Baron Geddon","Baron Rivendare","Bash","Battle Rage","Bear Trap","Beneath the Grounds","Bestial Wrath","Betrayal","Big Game Hunter","Bite","Blackwing Corruptor","Blackwing Technician","Blade Flurry","Blessed Champion","Blessing of Kings","Blessing of Might","Blessing of Wisdom","Blingtron 3000","Blizzard","Blood Imp","Blood Knight","Bloodfen Raptor","Bloodlust","Bloodmage Thalnos","Bloodsail Corsair","Bloodsail Raider","Bluegill Warrior","Bolf Ramshield","Bolster","Bolvar Fordragon","Bomb Lobber","Boneguard Lieutenant","Booty Bay Bodyguard","Boulderfist Ogre","Bouncing Blade","Brann Bronzebeard"];
    this.listItems = data.map((itm, idx) => ({text: itm, highlighted: !idx}))
    console.log('====', this.listItems[0], value);
  }   

  private _handleOutsideClick(e: Event) {
    if((e.target) !== this) {
      this.term ='';
    }
  }

  private _searchHandle(event: Event) {
    this.term = (<HTMLInputElement>event.target).value;
  }

  private _keydownHandle(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      this.filteredItems = changeHighlighted(this.filteredItems, e.key.replace('Arrow', ''))
    }
    if (e.key === 'Enter') {
      let sel: any = this.filteredItems.find((itm: any) => itm.highlighted);
      this.term = '';
      console.log('--you selected--', sel && (sel as any).text);
    }
    if (e.key === 'Escape') {
      this.term = '';
    }
  }

  override willUpdate(changedProperties: any) {
    
    if (changedProperties.has('term') ) {
       this.filteredItems = highlightFirst(filterByText(this.listItems, this.term));
    }
  }

  override render() {
    return html`<div class="auto-wrap"  @result=${this._onResultSelect}>
      <input @keyup=${this._searchHandle} @keydown=${this._keydownHandle} .value=${this.term}/> 
      <results-list .term=${this.term} .listItems=${this.filteredItems}></results-list>
    </div>`;
  }
  
  private _onResultSelect() {
    this.term = '';
  }
}
