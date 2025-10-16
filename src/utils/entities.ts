// Dependencies
import { immerable } from "immer";

// Importing player data from player.json
import playerJson from "@/data/player.json";

// Importing the interface of EntityData
import { BaseEntityData, PlayerData, EnemyData } from "@/types";

type EnemyActions = "attack";

type Action = {
  action: any;
  msg: string;
  actionType: EnemyActions;
};

// --------- ENTITIES ---------
export class Entity {
  [immerable] = true;

  public data!: BaseEntityData;

  constructor(data: BaseEntityData) {
    Object.assign(this, data);
  }

  // Returns an pure object from the entity
  toJSON() {
    return Object.fromEntries(Object.entries(this).filter(([key, value]) => typeof value !== "function"));
  }

  // Generates a random number
  random(max: number, min = 0) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % (max + 1 - min));
  }

  // Chance to hit an enemy (0 - 1)
  hitChance(target: Entity) {
    const attackerAccuracy = this.stats.accuracy ?? 0;
    const defenderEvasion = target.stats.evasion ?? 0;
    return Math.min(100, Math.max(0, attackerAccuracy - defenderEvasion));
  }

  // Attack to entity
  attack(target: Entity) {
    // Executing animation
    if (this.animations.atk) this.update({ currentAnim: "atk" });

    // Rest of the action
    if (this.random(100) > this.hitChance(target)) {
      // Entity Missed
      const newSpanMessages = structuredClone(target.spanMessages);
      newSpanMessages?.push({ value: "Missed" });
      target.update({ spanMessages: newSpanMessages });
      return {
        attackMsg: "The attack missed.",
        dmg: "Missed",
        timeToWait: 1000,
      };
    }

    // Entity Hit
    let loot = null;
    let dmg = 0;
    let crit = 0;
    const attack = this.stats.attack;
    const strength = this.stats.strength;

    // Crit
    this.random(100) > this.stats.critChance ? (crit = 1) : (crit = this.stats.crit);

    // Generating damage
    for (let i = 0; i < strength * crit; i++) {
      dmg += this.random(attack, 1); // 1 -> attack
    }

    // Reducing the enemy's life
    const { dmgRed, realDmg, isDead } = target.takeDamage(dmg);

    // If the attacker is the player, generates the target loot if it died
    if (isDead && target instanceof Enemy) {
      loot = target?.generateLoot(this as unknown as Player);
    }

    if (target.stats.health === 0) {
      this.update({ kills: (this.kills || 0) + 1 });
    }

    // Generating final message
    const attackMsg = this.getAttackMessage(realDmg, crit);

    // Telling the target that the damage was crit
    const spanMessage = crit > 1 ? { value: realDmg, type: "crit" } : { value: realDmg };
    const newSpanMessages = structuredClone(target?.spanMessages);
    newSpanMessages?.push(spanMessage);
    target.update({ spanMessages: newSpanMessages });

    // Calculating the time of the action
    const anim = this.animations["atk"];
    const animationFrames = anim.frames;
    const timeToWait = anim.duration * animationFrames.length;

    return { attackMsg, dmg, timeToWait, isDead, loot };
  }

  getAttackMessage(realDmg: number, crit: number) {
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
  takeDamage(amount: number) {
    // The max damage that can be reduced is half of the damage
    // The '-0.01' is used to guarantee that, if the number is 2.5, the round will round it to the number below (e.g. round(2.5) = 2)
    const dmgRed = Math.min(this.calcDamageReduction(), Math.round(amount / 2 - 0.01));
    const realDmg = Math.max(1, amount - dmgRed); // The min damage that will be done if the attacker hits, is 1

    // Debugging
    console.log("Damage: ", amount, "Reduction: ", dmgRed, "Real Damage", realDmg);

    // Reduce the health, never below 0
    this.update({
      "stats.health": Math.max(0, (this.stats.health || 0) - realDmg),
    });

    const isDead = this.stats.health - realDmg <= 0;

    //this.update({ dmgTaken: realDmg });

    // Adding the state animation of HIT and, after 1s, removing it
    const newStatesAnim = structuredClone(this.states);
    newStatesAnim.push("hit");
    this.update({ states: newStatesAnim });
    setTimeout(() => {
      this.update({ states: (prev: any) => prev.filter((item: any) => item !== "hit") });
    }, 1000);

    return { dmgRed, realDmg, isDead };
  }

  // Verify if its dead
  isDead() {
    return this.stats.health <= 0;
  }
}

// --- PLAYER ---
export class Player extends Entity {
  constructor(entity: PlayerData) {
    super(entity);
  }

  // Function that levels up the player
  levelUp(level: number) {
    // Getting the base stats values
    const BASE_HEALTH = playerJson["stats"]["health"];
    const BASE_ATTACK = playerJson["stats"]["attack"];
    const BASE_DEFENSE = playerJson["stats"]["defense"];
    const GROWTH_RATE = 1.5;

    // Setting up the next player stats
    const newHealth = Math.floor(BASE_HEALTH * (1 + (level - 1) * (GROWTH_RATE - 1)) - this.stats.maxHealth);
    const newAttack = Math.floor(BASE_ATTACK * (1 + (level - 1) * (GROWTH_RATE - 1)) - this.stats.attack);
    const newDefense = Math.floor(BASE_DEFENSE * (1 + (level - 1) * (GROWTH_RATE - 1)) - this.stats.defense);

    // Updating player stats
    this.update({ "stats.maxHealth": (prev: number) => prev + newHealth });
    this.update({ "stats.health": (prev: number) => prev + newHealth });
    this.update({ "stats.attack": (prev: number) => prev + newAttack });
    this.update({ "stats.defense": (prev: number) => prev + newDefense });

    // Setting levelup state animation
    const newStatesAnim = structuredClone(this.states);
    newStatesAnim.push("leveling");
    this.update({ states: newStatesAnim });
    setTimeout(() => {
      this.update({ states: (prev: any) => prev.filter((item: any) => item !== "leveling") });
    }, 1000);
  }

  // Functions that verify if the player can levelUp
  tryLevelUp() {
    // Verifies if the player has sufficient experience to levelup
    if (this.xp || 0 >= this.getNextLvXP()) {
      const newLevel = this.level + 1;

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
  getAttackMessage(realDmg: number, crit: number) {
    let msg =
      crit === 1
        ? `You landed a hit, dealing ${realDmg} points of damage.`
        : `You landed a critical hit! dealing ${realDmg} points of damage!`;
    return msg;
  }
}

// --- ENEMY ---
export class Enemy extends Entity {
  constructor(entity: EnemyData) {
    super(entity);
  }

  handleTurn(target: Entity): Partial<Action> | null {
    const chance = this.random(100); // generates a number between 0 and 100 (this number also counts!)
    const turn: Partial<Action> = {};

    if (chance >= 0) {
      // 100% Attack
      turn.action = this.attack(target);
      turn.msg = "The enemy tries to attack you";
      turn.actionType = "attack";
    }

    // If there is a turn action, returns the turn. If not, returns nothing
    return turn?.action ? turn : null;
  }

  generateLoot(player: Player) {
    const minXP = this.loot.xp[0];
    const maxXP = this.loot.xp[1];
    const experience = this.random(maxXP, minXP);

    player.update({ xp: (prev) => prev + experience });

    return { experience };
  }
}

// --------- ENEMIES ---------
// --- GOBLIN ---
export class Goblin extends Enemy {
  constructor(entity: EnemyData) {
    super(entity);
  }
}

// --- SNAKE ---
export class Snake extends Enemy {
  constructor(entity: EnemyData) {
    super(entity);
  }
}
export class VenomousSnake extends Enemy {
  constructor(entity: EnemyData) {
    super(entity);
  }
}

// Saying to TS that Entity has all atributes of EntityData
export interface Entity extends BaseEntityData {}
export interface Player extends PlayerData {}
export interface Enemy extends EnemyData {}
