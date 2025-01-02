import Phaser from 'phaser';
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import type { IUIServices } from '../../UIController';
import { servicesKey } from '../../UIController';
import { UIDataManager } from "../data/UIDataManager";
import { GameEventManager } from "../events/game/GameEventManager";
import { GameEvents } from "../events/game/GameEvents";
import { UIEventManager } from "../events/ui/UIEventManager";
import { Astroid } from "./Astroid";
import { Background } from "./Background";
import { Bullet } from './Bullet';
import { Ship } from "./Ship";

export default defineComponent({
  name: 'GameView',
  setup() {
    const score = ref(0);
    const services: IUIServices = inject(servicesKey) as IUIServices;
    const uiEventManager: UIEventManager = services.uiEventManager;
    const gameEventManager: GameEventManager = services.gameEventManager;
    const uiDataManager: UIDataManager = services.dataManager;
    let ship: Ship;
    let enemys: Astroid[] = [];
    let bullets: Phaser.GameObjects.Group;

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
          update: update
        }
      };

      new Phaser.Game(config);

      function update(this: Phaser.Scene) {
        // Update logic here
        /*if(background){
          background.update();
        }*/
        if (ship) {
          ship.update();
        }

        if (enemys) {
          enemys.forEach((enemy) => {
            enemy.update();
          });
        }

        if (bullets) {
          bullets.children.each((bullet: Phaser.GameObjects.GameObject) => {
            (bullet as Bullet).update();
          });
        }
      }

      function create(this: Phaser.Scene) {
        this.input.on('pointerdown', () => {
          uiEventManager.dispatchEvent(GameEvents.HitEvent, { enemy: 10 });
          gameEventManager.dispatchEvent(GameEvents.HitEvent, { enemy: 10 });
        });

        new Background(this, 0, 0);
        ship = new Ship(this, this.cameras.main.width / 2, this.cameras.main.height / 2)

        createEnemy(this);

        bullets = this.add.group({
          classType: Bullet,
          runChildUpdate: true
        });

        // Add collision detection between ship and astroids
        enemys.forEach((enemy) => {
          this.physics.add.collider(ship, enemy, handleCollision, undefined, this);
        });

      }

      function createEnemy(scene: Phaser.Scene) {
        for (let i = 0; i < 4; i++) {
          let x = Math.random() * scene.cameras.main.width;
          let y = Math.random() * scene.cameras.main.height;
          const centerX = scene.cameras.main.width / 2;
          const centerY = scene.cameras.main.height / 2;
          const distanceFromCenter = 200; // Minimum distance from the center

          if (Math.abs(x - centerX) < distanceFromCenter && Math.abs(y - centerY) < distanceFromCenter) {
            i--; // Retry if the position is too close to the center
            continue;
          }

          //Round to the nearest 10
          x = Math.round(x / 10) * 10;
          y = Math.round(y / 10) * 10;

          console.log('Creating enemy at', x, y);

          const enemy = new Astroid(scene, x, y, "astroid" + i);
          enemys.push(enemy);
        }
      }

      function handleCollision(ship: Phaser.Types.Physics.Arcade.GameObjectWithBody, astroid: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        console.log('Collision detected between ship and astroid');
        
      }
    });

    watch(uiDataManager.gameScore.score.ref, (newValue) => {
      score.value = newValue;
    });

    return () => (
      <div>
        <div id='score-container'>Score: {score.value}</div>
      </div>
    );
  },
});