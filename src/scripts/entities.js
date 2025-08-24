// IMPORTANT!!!
// when settings the entity data (setData), do NOT use produce.
// Instead, use only draft!

export class Entity {
  constructor(entity, setEntity) {
    this.data = entity;
    this.setData = setEntity;
  }
  
  // Generates a random number
  random(max, min=0) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % ((max + 1) - min));
  }

  handleTurn() {
    return;
  }

  // Chance to hit an enemy (0 - 1)
  hitChance(target) {
    const attackerAccuracy = this.data.stats.accuracy ?? 0;
    const defenderEvasion = target.data.stats.evasion ?? 0;
    return Math.min(100, Math.max(0, attackerAccuracy - defenderEvasion));
  }

  // Attack to entity
  attack(target) {
    if (this.random(100) > this.hitChance(target)) {
      // Entity Missed
      return { attackMsg: "The attack missed.", killed: false };
    }

    // Entity Hit
    let dmg = 0;
    let crit = 0;
    let killed = false;
    const attack = this.data.stats.attack;
    const strength = this.data.stats.strength;

    // Executing animation
    if (this.data.animations.atk) {
    this.setData((draft => {
      draft.currentAnim = 'atk';
    }));
    };


    // Crit
    (this.random(100) > this.data.stats.critChance) ?
    crit = 1 :
    crit = this.data.stats.crit;

    // Generating damage
    for (let i = 0; i < (strength * crit); i++) {
      dmg += this.random(attack, 1);  // 1 -> attack
    }

    // Generating final message
    const attackMsg = this.getAttackMessage(dmg, crit);

    // Reducing the enemy's life
    target.takeDamage(dmg);
    if ((target?.data?.stats?.health - dmg) <= 0) killed = true;  // Getting the future state of the target

    return {attackMsg, killed};
  }

  getAttackMessage(dmg, crit) {
    let msg = crit === 1  
      ? `The attack hit, dealing ${dmg} points of damage.`
      : `Critical hit! The attack deals ${dmg} points of damage!`;

    return msg;
  }

  // Receive damage
  takeDamage(amount) {
    this.setData(draft => {
      // Guarantee that the stats exists
      if (!draft.stats) draft.stats = { health: 0 };

      // Reduce the health, never below 0
      draft.stats.health = Math.max(0, (draft.stats.health || 0) - amount);
    });
  }

  // Verify if its dead
  isDead() {
    return this.data.stats?.health <= 0;
  }
}

// --- PLAYER ---
export class Player extends Entity {
  constructor(entity, setEntity) {
    super(entity, setEntity);
  }

  // Generating player attack message
  getAttackMessage(dmg, crit) {
    let msg = crit === 1  
      ? `You landed a hit, dealing ${dmg} points of damage.`
      : `You landed a critical hit! dealing ${dmg} points of damage!`;

    return msg;
  }
}

// --- GOBLIN ---
export class Goblin extends Entity {
  constructor(entity, setEntity) {
    super(entity, setEntity);
  }

  handleTurn(target) {
    const chance = this.random(100)  // generates a number between 0 and 100
    let turn = {};

    if (chance < 10) {  // 10% - Attack
      turn.action = this.attack(target);
      turn.msg = 'The enemy tries to attack you';
      turn.actionType = 'atk'
    } else 
    if (chance < 50) {  // 40% - Attack
      turn.action = this.attack(target);
      turn.msg = 'The enemy tries to attack you';
      turn.actionType = 'atk'
    } else
    if (chance <= 100) {  // 50% - Attack
      turn.action = this.attack(target);
      turn.msg = 'The enemy tries to attack you';
      turn.actionType = 'atk'
    }

    // Calculating the time of the enemy's turn
    const anim = this.data.animations[turn.actionType];
    const animationFrames = Object.values(anim[0]);
    turn.timeToWait = anim[1] * animationFrames.length;

    return turn;
  }
}
