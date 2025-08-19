import { produce } from "immer";

export class Entity {
  constructor(entity, setEntity) {
    this.data = entity;
    this.setData = setEntity;
  }

  attack(entity, dmg) {
    entity.take_damage(dmg);
  }
  
  take_damage(amount) {
    console.log('ouch!')
    this.setData(produce(draft => {
      draft.stats.health -= amount;
    }));
  }

  changeAnim(anim) {
    this.setData(produce(draft => {
      draft.currentAnim = anim;
  }));
  }

}