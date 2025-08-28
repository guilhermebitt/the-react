// IMPORTANT!!!
// when settings the entity data (setData), do NOT use produce.
// Instead, use only draft!



// --------- ENTITIES ---------
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
    // Executing animation
    if (this.data.animations.atk) {
      this.setData((draft => {
      draft.currentAnim = 'atk';
    }))};

    // Rest of the action
    if (this.random(100) > this.hitChance(target)) {
      // Entity Missed
      target.setData(draft => draft.dmgTaken = "Missed");
      return { attackMsg: "The attack missed.", killed: false, dmg: "Missed", timeToWait: 1000};
    };

    // Entity Hit
    let dmg = 0;
    let crit = 0;
    let killed = false;
    const attack = this.data.stats.attack;
    const strength = this.data.stats.strength;

    // Crit
    (this.random(100) > this.data.stats.critChance) ?
    crit = 1 :
    crit = this.data.stats.crit;

    // Generating damage
    for (let i = 0; i < (strength * crit); i++) {
      dmg += this.random(attack, 1);  // 1 -> attack
    }

    // Reducing the enemy's life
    const { dmgRed, realDmg } = target.takeDamage(dmg);
    if ((target?.data?.stats?.health - realDmg) <= 0) killed = true;  // Getting the future state of the target

    // Generating final message
    const attackMsg = this.getAttackMessage(realDmg, crit, dmg, dmgRed);

    // Telling the target that the damage was crit
    crit > 1 ? target.setData(draft => draft.dmgWasCrit = true) : target.setData(draft => draft.dmgWasCrit = false)

    // Calculating the time of the action
    const anim = this.data.animations['atk'];
    const animationFrames = anim.frames;
    const timeToWait = (anim.duration * animationFrames.length);

    return {attackMsg, killed, dmg, timeToWait};
  }

  getAttackMessage(realDmg, crit) {
    let msg = crit === 1  
      ? `The attack hit, dealing ${realDmg} points of damage.`
      : `Critical hit! The attack deals ${realDmg} points of damage!`;
    return msg;
  }

  calcDamageReduction() {
    // This function can be used later for effectiveness (e.g. Water is super effectiveness against Fire)
    const constitution = this?.data?.stats?.constitution;
    const defense = this?.data?.stats?.defense;
    let damageReduction = 0;

    // Generating damage reduction
    for (let i = 0; i < constitution; i++) {
      damageReduction += this.random(defense, 1);  // 1 -> defense
    }

    return damageReduction;
  }

  // Receive damage
  takeDamage(amount) {
    // The max damage that can be reduced is half of the damage
    // The '-0.01' is used to guarantee that, if the number is 2.5, the round will round it to the number below (e.g. round(2.5) = 2)
    const dmgRed = Math.min(this.calcDamageReduction(), Math.round((amount / 2) - 0.01));  
    const realDmg = Math.max(1, (amount - dmgRed));  // The min damage that will be done if the attacker hits, is 1

    // Debugging
    console.log ('Damage: ', amount, 'Reduction: ', dmgRed, 'Real Damage', realDmg);

    this.setData(draft => {
      // Guarantee that the stats exists
      if (!draft.stats) draft.stats = { health: 0 };

      // Reduce the health, never below 0
      draft.stats.health = Math.max(0, (draft.stats.health || 0) - realDmg);
    });
    this.setData(draft => draft.dmgTaken = realDmg);

    return { dmgRed, realDmg };
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
  getAttackMessage(realDmg, crit) {
    let msg = crit === 1  
      ? `You landed a hit, dealing ${realDmg} points of damage.`
      : `You landed a critical hit! dealing ${realDmg} points of damage!`;
    return msg;
  }
}

// --- ENEMY ---
export class Enemy extends Entity {
  constructor(entity, setEntity) {
    super(entity, setEntity);
  }

  handleTurn(target) {
    const chance = this.random(100)  // generates a number between 0 and 100
    let turn = {};

    if (chance >= 0) {  // 100% Attack
      turn.action = this.attack(target);
      turn.msg = 'The enemy tries to attack you';
      turn.actionType = 'atk'
    }

    return turn;
  }
}
// ----------------------------



// --------- ENEMIES ---------
// --- GOBLIN ---
export class Goblin extends Enemy {
  constructor(entity, setEntity) {
    super(entity, setEntity);
  }
}

// --- SNAKE ---
export class Snake extends Enemy {
  constructor(entity, setEntity) {
    super(entity, setEntity);
  }
}
// ---------------------------
