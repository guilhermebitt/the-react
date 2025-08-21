// Dependencies
import { produce } from "immer";

export class Entity {
  constructor(entity, setEntity) {
    this.data = entity;
    this.setData = setEntity;
  }

  // Attack to entity?
  attack(entity, dmg) {
    entity.takeDamage(dmg);
  }

  // Recieve damage
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
