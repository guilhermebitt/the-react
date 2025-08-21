// Dependencies
import { produce } from "immer";
import Chance from "chance";
var chance = new Chance();

export class Entity {
  constructor(entity, setEntity) {
    this.data = entity;
    this.setData = setEntity;
  }

  // Attack to entity
  attack(entity, dmg) {
    // basically, if you don't pass the dmg value to the function, it will be the entity strength
    dmg = dmg ?? this.data.stats.attack;

    entity.takeDamage(dmg);

    const msg = chance.integer({ min: -1, max: 1 })

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
