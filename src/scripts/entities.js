// Dependencies
import { produce } from "immer";
import gameData from '../data/game.json' with { type: 'json' };
import Chance from "chance";
var chance = new Chance();

export class Entity {
  constructor(entity, setEntity) {
    this.data = entity;
    this.setData = setEntity;
  }

  // Chance to hit an enemy (0 - 1)
  hitChance(target) {
    const baseHit = gameData.baseHitChance;
    const attackerAccuracy = this.data.stats.accuracy ?? 0;
    const defenderEvasion = target.data.stats.evasion ?? 0;
    return Math.min(1, Math.max(0, baseHit + attackerAccuracy - defenderEvasion));
  }

  // Attack to entity
  attack(target, dmg) {
    if (chance.floating({ min: 0, max: 1 }) > this.hitChance(target)) {
      // Miss
      return "Errou!";
    }

    // Hit
    // basically, if you don't pass the dmg value to the function, it will be the entity attack
    dmg = dmg ?? this.data.stats.attack;

    // Checking if the entity crit
    let mod = 0;
    const crited = (chance.floating({min: 0, max: 1}) < this.data.stats.critChance);
    crited ? mod = this.data.stats.crit : mod = 1;
    const finalDmg = Math.max(0, (dmg * mod));
    
    let msg = crited ? "Critou!" : "Acertou!";

    target.takeDamage(finalDmg);

    return msg;
  }

  // Receive damage
  takeDamage(amount) {
    this.setData(produce(draft => {
      // Guarantee that the stats exists
      if (!draft.stats) draft.stats = { health: 0 };

      // Reduce the health, never below 0
      draft.stats.health = Math.max(0, (draft.stats.health || 0) - amount);
    }));
  }

  // Verify if its dead
  isDead() {
    return this.data.stats?.health <= 0;
  }

  // Change anim manually (if needed)
  changeAnim(anim) {

    this.setData(produce(draft => {
      draft.currentAnim = anim;
    }));
  }
}

// Goblin Inherits Entity
export class Goblin extends Entity {
  constructor(entity, setEntity) {
    super(entity, setEntity);
  }
}
