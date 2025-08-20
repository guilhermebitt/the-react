// Dependencies
import { produce } from "immer";

export class Entity {
  constructor(entity, setEntity) {
    this.data = entity;
    this.setData = setEntity;
  }

  attack(entity, dmg) {
    entity.takeDamage(dmg);
  }

  takeDamage(amount) {
    this.setData(produce(draft => {
      draft.stats.health -= amount;
    }));
  }

  // Temporary - just to check animations
  changeAnim(anim) {
    this.setData(produce(draft => {
      draft.currentAnim = anim;
  }));
  }
}

export class Goblin extends Entity {
  constructor(entity, setEntity) {
    super(entity, setEntity)
  }
}
