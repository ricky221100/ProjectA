import * as CANNON from 'cannon';
import * as THREE from 'three';
import {DiceD6, DiceManager} from 'threejs-dice';

export class MyDice {

  constructor(canvas: HTMLCanvasElement) {
    // Setup your threejs scene
    console.log('MyDice.constructor()');
    const scene = new THREE.Scene();
    const world = new CANNON.World();
    DiceManager.setWorld(world);

    const SCREEN_WIDTH = window.innerWidth;
    const SCREEN_HEIGHT = window.innerHeight;
    const VIEW_ANGLE = 45;
    const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    const NEAR = 0.01;
    const FAR = 20000;
    const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 30, 30);

    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambient = new THREE.AmbientLight('#ffffff', 0.3);
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
    directionalLight.position.x = -1000;
    directionalLight.position.y = 1000;
    directionalLight.position.z = 1000;
    scene.add(directionalLight);

    const light = new THREE.SpotLight(0xefdfd5, 1.3);
    light.position.y = 100;
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 110;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);


    // Create a dice
    const dice = new DiceD6({
      backColor: '#ffffff'
    });
    scene.add(dice.getObject());

    // If you want to place the mesh somewhere else, you have to update the body
    dice.getObject().position.x = 150;
    dice.getObject().position.y = 100;
    dice.getObject().rotation.x = 20 * Math.PI / 180;
    dice.updateBodyFromMesh();

    // Set the value of the side, which will be upside after the dice lands
    DiceManager.prepareValues([{dice, value: 6}]);

    const animate = () => {
      world.step(1.0 / 60.0);

      dice.updateMeshFromBody(); // Call this after updating the physics world for rearranging the mesh according to the body

      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

  }
}
