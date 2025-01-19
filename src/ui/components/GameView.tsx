import Phaser from 'phaser';
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import type { IUIServices } from '../../UIController';
import { servicesKey } from '../../UIController';
import { UIDataManager } from "../data/UIDataManager";
import { GameEvents } from '../events/game/GameEvents';
import { UIEventManager } from "../events/ui/UIEventManager";
import { Astroid } from "./Astroid";
import { Background } from "./Background";
import { Bullet } from './Bullet';
import { EnemyShip } from './EnemyShip';
import { Explosion } from './Explosion';
import { LevelFactory } from './LevelFactory';
import { LivesPanel } from './LivesPanel';
import { Ship } from "./Ship";

export default defineComponent({
  name: 'GameView',
  setup() {
    const score = ref(0);
    const lives = ref(0);
    const gameOver = ref(false);

    const services: IUIServices = inject(servicesKey) as IUIServices;
    const uiEventManager: UIEventManager = services.uiEventManager;
    const uiDataManager: UIDataManager = services.dataManager;
    let ship: Ship;
    let explosion: Explosion;
    let enemies: Phaser.GameObjects.Group;
    let bullets: Phaser.GameObjects.Group;
    let livesPanel: LivesPanel;
    let currentScene: Phaser.Scene;
    let enemyShip: EnemyShip;
    let levelFactory: LevelFactory;

    function newLife(scene: Phaser.Scene) {
      ship = new Ship(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2);
    }

    function createNewEnemy(scene: Phaser.Scene) {
      enemyShip = new EnemyShip(scene, -120, scene.cameras.main.height / 4, ship, "enemyShip", 3);
    }

    function addColliders(scene: Phaser.Scene) {
      scene.physics.add.collider(ship, enemies, function (this: Phaser.Scene, ship, astroid) {
        console.log('Collision detected between ship and astroid');
        const position = new Phaser.Math.Vector2((ship as Phaser.GameObjects.Sprite).x, (ship as Phaser.GameObjects.Sprite).y);
        const angle = (ship as Phaser.GameObjects.Sprite).angle;
        ship.destroy();
        uiEventManager.dispatchEvent(GameEvents.ShipCollisionEvent);

        explosion = new Explosion(this, position.x, position.y, angle);
        handleAstroidHitEnemy.call(this, astroid as Phaser.GameObjects.Sprite);
      }, undefined, scene);

      scene.physics.add.collider(bullets, enemies, function (this: Phaser.Scene, bullet, astroid) {
        if ((bullet as Bullet).bulletType === Bullet.PLAYER) {
          handleAstroidHitEnemy.call(this, astroid as Phaser.GameObjects.Sprite);
          bullet.destroy();
        }
      }, undefined, scene);

      scene.physics.add.collider(bullets, ship, function (this: Phaser.Scene, bullet, ship) {
        console.log('Collision detected between ship and bullet');
        const position = new Phaser.Math.Vector2((ship as Phaser.GameObjects.Sprite).x, (ship as Phaser.GameObjects.Sprite).y);
        const angle = (ship as Phaser.GameObjects.Sprite).angle;
        bullet.destroy();
        ship.destroy();
        uiEventManager.dispatchEvent(GameEvents.ShipCollisionEvent);

        explosion = new Explosion(this, position.x, position.y, angle);
      }, undefined, scene);
    }

    function handleAstroidHitEnemy(this: Phaser.Scene, astroid: Phaser.GameObjects.Sprite) {
      const sizeType = (astroid as Astroid).sizeType;
      const position = new Phaser.Math.Vector2(astroid.x, astroid.y);
      const astroidID = (astroid as Astroid).id;

      uiEventManager.dispatchEvent(GameEvents.HitEvent, { enemy: sizeType });

      astroid.destroy();
      if (sizeType > 1) {
        createSmallerEnemies.call(this, sizeType, position, astroidID);
      }
    }

    function createSmallerEnemies(this: Phaser.Scene, sizeType: number, position: Phaser.Math.Vector2, parentID: string) {
      const newSizeType = sizeType - 1;
      const newEnemies = 2;
      for (let i = 0; i < newEnemies; i++) {
        const newAstroid = new Astroid(this, position.x, position.y, parentID + "-" + i, newSizeType);
        enemies.add(newAstroid);
      }
    }

    onMounted(() => {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
          }
        },
        scene: {
          create: create,
          update: update,
        },
        input: {
          keyboard: true,
          mouse: true,
          touch: true,
          gamepad: true
        }
      };

      new Phaser.Game(config);

      function update(this: Phaser.Scene) {
        if (ship) {
          ship.update();
        }
        if (enemyShip) {
          enemyShip.update();
        }
      }

      function create(this: Phaser.Scene) {
        currentScene = this;

        levelFactory = new LevelFactory(3);

        currentScene.events.on('shoot', (bullet: Bullet) => {
          bullets.add(bullet);
        });

        new Background(currentScene, 0, 0);
        livesPanel = new LivesPanel(currentScene, currentScene.cameras.main.width - 100, 0);

        bullets = currentScene.add.group({
          classType: Bullet,
          runChildUpdate: true
        });

        enemies = currentScene.add.group({
          classType: Astroid,
          runChildUpdate: true,
        });

        createAstroids(currentScene);

        uiEventManager.dispatchEvent(GameEvents.GameSetupComplete);
      }

      function createAstroids(scene: Phaser.Scene) {
        for (let i = 0; i < levelFactory.getAmountOfAstroids(); i++) {
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

          const enemy = new Astroid(scene, x, y, "astroid" + i, 3);
          enemies.add(enemy);
        }
      }
    });

    watch(uiDataManager.game.score.ref, (newValue) => {
      score.value = newValue;
      livesPanel.setScore(newValue);
    });

    watch(uiDataManager.game.lives.ref, (newValue) => {
      lives.value = newValue;
      livesPanel.setLives(newValue);

      if (newValue > 0) {
        newLife(currentScene); // Use the stored scene instance
        addColliders(currentScene);

      }

      createNewEnemy(currentScene);

    });

    return () => (
      <>
      </>
    );
  },
});