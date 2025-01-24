import Phaser from 'phaser';
import { GameEvents } from '../events/game/GameEvents';
import { UIEventManager } from "../events/ui/UIEventManager";
import { Astroid } from './Astroid';
import { Bullet } from './Bullet';
import { EnemyShip } from './EnemyShip';
import { Explosion } from './Explosion';
import { LevelFactory } from './LevelFactory';
import { Ship } from "./Ship";

export class LevelEngine {

    protected _currentScene: Phaser.Scene;
    protected _levelFactory!: LevelFactory;
    protected _ship!: Ship;
    protected _explosion!: Explosion;
    protected _astroids!: Phaser.GameObjects.Group;
    protected _bullets!: Phaser.GameObjects.Group;
    protected _enemies!: Phaser.GameObjects.Group;
    protected _uiEventManager!: UIEventManager;

    constructor(scene: Phaser.Scene, levelFactory: LevelFactory, uiEventManager: UIEventManager) {
        this._currentScene = scene;
        this._levelFactory = levelFactory;
        this._uiEventManager = uiEventManager;
    }

    public create() {
        this._currentScene.events.on('shoot', (bullet: Bullet) => {
            this._bullets.add(bullet);
        });

        this._bullets = this._currentScene.add.group({
            classType: Bullet,
            runChildUpdate: true
        });

        this._astroids = this._currentScene.add.group({
            classType: Astroid,
            runChildUpdate: true,
        });

        this._enemies = this._currentScene.add.group({
            classType: EnemyShip,
            runChildUpdate: true,
        });

        this.createAstroids(this._currentScene);
        this.createNewEnemies(this._currentScene);
        this.addColliders();
    }

    protected createNewEnemies(scene: Phaser.Scene) {
        const enemies = this._levelFactory.getEnemies();
        enemies.forEach(enemy => {
            if (enemy.enemyType === "EnemyShip") {
                scene.time.addEvent({
                    delay: enemy.timeBeforAppear,
                    callback: () => {
                        //Create a randow enemy ship id and pass it to the enemy ship. Like ""enemyShip" + i"
                        this._enemies.add(new EnemyShip(scene, enemy.x, enemy.y, this._ship, "muu", 3));
                    },
                    callbackScope: this
                });
            }
        });
    }

    public gameOver() {
        this._ship.destroy();
        this._astroids.clear(true, true);
        this._bullets.clear(true, true);
        this._enemies.clear(true, true);
    }

    public update() {
        if (this._ship) {
            this._ship.update();
        }
    }


    public newLife(scene: Phaser.Scene) {
        this._ship = new Ship(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2);
        this.addShipColliders();
    }

    protected createAstroids(scene: Phaser.Scene) {
        for (let i = 0; i < this._levelFactory.getAmountOfAstroids(); i++) {
            let x = Math.random() * scene.cameras.main.width;
            let y = Math.random() * scene.cameras.main.height;
            const centerX = scene.cameras.main.width / 2;
            const centerY = scene.cameras.main.height / 2;
            const distanceFromCenter = 200;

            if (Math.abs(x - centerX) < distanceFromCenter && Math.abs(y - centerY) < distanceFromCenter) {
                i--;
                continue;
            }

            x = Math.round(x / 10) * 10;
            y = Math.round(y / 10) * 10;

            const astroid = new Astroid(scene, x, y, "astroid" + i, 3);
            this._astroids.add(astroid);
        }
    }

    protected manageHitAstroid(this: LevelEngine, astroid: Phaser.GameObjects.Sprite) {
        const sizeType = (astroid as Astroid).sizeType;
        const position = new Phaser.Math.Vector2(astroid.x, astroid.y);
        const astroidID = (astroid as Astroid).id;

        this._uiEventManager.dispatchEvent(GameEvents.HitEvent, { enemy: sizeType });

        astroid.destroy();
        if (sizeType > 1) {
            this.createSmallerEnemies.call(this, sizeType, position, astroidID);
        }
    }

    protected createSmallerEnemies(this: LevelEngine, sizeType: number, position: Phaser.Math.Vector2, parentID: string) {
        const newSizeType = sizeType - 1;
        const newEnemies = 2;
        for (let i = 0; i < newEnemies; i++) {
            const newAstroid = new Astroid(this._currentScene, position.x, position.y, parentID + "-" + i, newSizeType);
            this._astroids.add(newAstroid);
        }
    }

    /**
     * Adds colliders for the ship with bullets and asteroids in the current scene.
     * 
     * This method sets up collision detection between the ship and bullets, and between the ship and asteroids.
     * When a collision is detected, it handles the destruction of the involved objects and triggers the appropriate events.
     * 
     * - When a bullet collides with the ship:
     *   - Logs the collision.
     *   - Destroys both the bullet and the ship.
     *   - Dispatches the `ShipCollisionEvent`.
     *   - Creates an explosion at the ship's position and angle.
     * 
     * - When an asteroid collides with the ship:
     *   - Logs the collision.
     *   - Destroys the ship.
     *   - Dispatches the `ShipCollisionEvent`.
     *   - Creates an explosion at the ship's position and angle.
     *   - Handles the asteroid hit on the enemy.
     * 
     * @protected
     */
    protected addShipColliders() {
        this._currentScene.physics.add.collider(this._bullets, this._ship, (bullet, ship) => {
            console.log('Collision detected between ship and bullet');
            const position = new Phaser.Math.Vector2((ship as Phaser.GameObjects.Sprite).x, (ship as Phaser.GameObjects.Sprite).y);
            const angle = (ship as Phaser.GameObjects.Sprite).angle;
            bullet.destroy();
            ship.destroy();
            this._uiEventManager.dispatchEvent(GameEvents.ShipCollisionEvent);

            this._explosion = new Explosion(this._currentScene, position.x, position.y, angle);
        }, undefined, this._currentScene);

        this._currentScene.physics.add.collider(this._ship, this._astroids, (ship, astroid) => {
            console.log('Collision detected between ship and astroid');
            const position = new Phaser.Math.Vector2((ship as Phaser.GameObjects.Sprite).x, (ship as Phaser.GameObjects.Sprite).y);
            const angle = (ship as Phaser.GameObjects.Sprite).angle;
            ship.destroy();
            this._uiEventManager.dispatchEvent(GameEvents.ShipCollisionEvent);

            this._explosion = new Explosion(this._currentScene, position.x, position.y, angle);
            this.manageHitAstroid(astroid as Phaser.GameObjects.Sprite);
        }, undefined, this._currentScene);

        this._currentScene.physics.add.collider(this._ship, this._enemies, (ship, enemy) => {
            const position = new Phaser.Math.Vector2((ship as Phaser.GameObjects.Sprite).x, (ship as Phaser.GameObjects.Sprite).y);
            const angle = (ship as Phaser.GameObjects.Sprite).angle;
            ship.destroy();
            this._uiEventManager.dispatchEvent(GameEvents.ShipCollisionEvent);

            this._explosion = new Explosion(this._currentScene, position.x, position.y, angle);
            enemy.destroy();
        }, undefined, this._currentScene);
    }

    /**
     * Adds colliders to the current scene for handling collisions between bullets and asteroids, 
     * and bullets and enemies. When a bullet of type PLAYER collides with an asteroid, 
     * the asteroid hit handler is called and the bullet is destroyed. When a bullet of type PLAYER 
     * collides with an enemy, both the enemy and the bullet are destroyed.
     * 
     * @protected
     */
    protected addColliders() {
        this._currentScene.physics.add.collider(this._bullets, this._astroids, (bullet, astroid) => {
            if ((bullet as Bullet).bulletType === Bullet.PLAYER) {
                this.manageHitAstroid(astroid as Phaser.GameObjects.Sprite);
                bullet.destroy();
            }
        }, undefined, this._currentScene);

        this._currentScene.physics.add.collider(this._bullets, this._enemies, (bullet, enemy) => {
            if ((bullet as Bullet).bulletType === Bullet.PLAYER) {
                enemy.destroy();
                bullet.destroy();
            }
        }, undefined, this._currentScene);
    }
}