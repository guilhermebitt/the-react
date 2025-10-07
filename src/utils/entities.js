import { immerable } from 'immer';
import playerJson from '../data/player.json';

// --------- ENTITIES ---------
export class Entity {
  [immerable] = true;

  constructor(data) {
    // deconstruct the data to get the update function
    const { update, ...rest } = data;

    // Add the update function separately
    if (update) this.update = update; // adds the function after the clone

    // Add the rest to the instance
    Object.assign(this, rest);
  }

  // Returns an pure object from the entity
  toJSON() {
    return Object.fromEntries(
      Object.entries(this).filter(([key, value]) => typeof value !== 'function')
    );
  }

  // Generates a random number
  random(max, min = 0) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % (max + 1 - min));
  }

  handleTurn() {
    return;
  }

  // Chance to hit an enemy (0 - 1)
  hitChance(target) {
    const attackerAccuracy = this.stats.accuracy ?? 0;
    const defenderEvasion = target.stats.evasion ?? 0;
    return Math.min(100, Math.max(0, attackerAccuracy - defenderEvasion));
  }

  // Attack to entity
  attack(target) {
    // Executing animation
    if (this.animations.atk) this.update({ currentAnim: 'atk' });

    // Rest of the action
    if (this.random(100) > this.hitChance(target)) {
      // Entity Missed
      target.update({ dmgTaken: 'Missed', dmgWasCrit: false });
      return {
        attackMsg: 'The attack missed.',
        dmg: 'Missed',
        timeToWait: 1000,
      };
    }

    // Entity Hit
    let dmg = 0;
    let crit = 0;
    const attack = this.stats.attack;
    const strength = this.stats.strength;

    // Crit
    this.random(100) > this.stats.critChance
      ? (crit = 1)
      : (crit = this.stats.crit);

    // Generating damage
    for (let i = 0; i < strength * crit; i++) {
      dmg += this.random(attack, 1); // 1 -> attack
    }

    // Reducing the enemy's life
    const { dmgRed, realDmg, isDead } = target.takeDamage(dmg);

    // If the attacker is the player, generates the target loot if it died
    if (isDead && this.entityType === 'player') target?.generateLoot(this)

    if (target.stats.health === 0) {
      this.update({ kills: (this.kills || 0) + 1 });
    }

    // Generating final message
    const attackMsg = this.getAttackMessage(realDmg, crit, dmg, dmgRed);

    // Telling the target that the damage was crit
    crit > 1
      ? target.update({ dmgWasCrit: true })
      : target.update({ dmgWasCrit: false });

    // Calculating the time of the action
    const anim = this.animations['atk'];
    const animationFrames = anim.frames;
    const timeToWait = anim.duration * animationFrames.length;

    return { attackMsg, dmg, timeToWait, isDead };
  }

  getAttackMessage(realDmg, crit) {
    let msg =
      crit === 1
        ? `The attack hit, dealing ${realDmg} points of damage.`
        : `Critical hit! The attack deals ${realDmg} points of damage!`;
    return msg;
  }

  calcDamageReduction() {
    // This function can be used later for effectiveness (e.g. Water is super effectiveness against Fire)
    const constitution = this?.stats?.constitution;
    const defense = this?.stats?.defense;
    let damageReduction = 0;

    // Generating damage reduction
    for (let i = 0; i < constitution; i++) {
      damageReduction += this.random(defense, 1); // 1 -> defense
    }

    return damageReduction;
  }

  // Receive damage
  takeDamage(amount) {
    // The max damage that can be reduced is half of the damage
    // The '-0.01' is used to guarantee that, if the number is 2.5, the round will round it to the number below (e.g. round(2.5) = 2)
    const dmgRed = Math.min(
      this.calcDamageReduction(),
      Math.round(amount / 2 - 0.01)
    );
    const realDmg = Math.max(1, amount - dmgRed); // The min damage that will be done if the attacker hits, is 1

    // Debugging
    console.log(
      'Damage: ',
      amount,
      'Reduction: ',
      dmgRed,
      'Real Damage',
      realDmg
    );

    // Reduce the health, never below 0
    this.update({
      'stats.health': Math.max(0, (this.stats.health || 0) - realDmg),
    });

    const isDead = this.stats.health - realDmg <= 0;

    this.update({ dmgTaken: realDmg });

    return { dmgRed, realDmg, isDead };
  }

  // Verify if its dead
  isDead() {
    return this.stats.health <= 0;
  }
}

// --- PLAYER ---
export class Player extends Entity {
  constructor(entity) {
    super(entity);
  }

  // Function that levels up the player
  levelUp(level) {
    console.log(level)

    // Getting the base stats values
    const BASE_HEALTH = playerJson['stats']['health'];
    const BASE_ATTACK = playerJson['stats']['attack'];
    const BASE_DEFENSE = playerJson['stats']['defense'];
    const GROWTH_RATE = 1.5;

    console.log(BASE_HEALTH);

    // Setting up the next player stats
    const newHealth = Math.floor((BASE_HEALTH * (1 + (level - 1) * (GROWTH_RATE - 1))) - this.stats.maxHealth)
    const newAttack = Math.floor((BASE_ATTACK * (1 + (level - 1) * (GROWTH_RATE - 1))) - this.stats.attack)
    const newDefense = Math.floor((BASE_DEFENSE * (1 + (level - 1) * (GROWTH_RATE - 1))) - this.stats.defense)

    // Updating player stats
    this.update({ "stats.maxHealth": prev => prev + newHealth })
    this.update({ "stats.health": prev => prev + newHealth })
    this.update({ "stats.attack": prev => prev + newAttack })
    this.update({ "stats.defense": prev => prev + newDefense })
  }

  // Functions that verify if the player can levelUp
  tryLevelUp() {
    // Verifies if the player has sufficient experience to levelup
    if (this.xp >= this.getNextLvXP()) {
      const newLevel = this.level + 1

      this.update({ level: newLevel });
      this.levelUp(newLevel);
      return newLevel;
    }
  }

  // Calculates the experience needed to levelup
  getNextLvXP() {
    const BASE_XP = 10;
    const GROWTH = 1.2;
    // Square formula to get the next level needed experience
    //return Math.floor(BASE_XP * (this.level + 1) ** 2 * SCALE - BASE_XP * this.level);
    return Math.floor(BASE_XP * Math.pow(this.level, GROWTH));
  }

  // Generating player attack message
  getAttackMessage(realDmg, crit) {
    let msg =
      crit === 1
        ? `You landed a hit, dealing ${realDmg} points of damage.`
        : `You landed a critical hit! dealing ${realDmg} points of damage!`;
    return msg;
  }
}

// --- ENEMY ---
export class Enemy extends Entity {
  constructor(entity) {
    super(entity);
  }

  handleTurn(target) {
    const chance = this.random(100); // generates a number between 0 and 100
    let turn = {};

    if (chance >= 0) {
      // 100% Attack
      turn.action = this.attack(target);
      turn.msg = 'The enemy tries to attack you';
      turn.actionType = 'atk';
    }

    return turn;
  }

  generateLoot(player) {
    const minXP = this.loot.xp[0];
    const maxXP = this.loot.xp[1];
    const experience = this.random(maxXP, minXP);

    player.update({ xp: prev => prev + experience })

    return experience;
  }
}

// --------- ENEMIES ---------
// --- GOBLIN ---
export class Goblin extends Enemy {
  constructor(entity) {
    super(entity);
  }
}

// --- SNAKE ---
export class Snake extends Enemy {
  constructor(entity) {
    super(entity);
  }
}
