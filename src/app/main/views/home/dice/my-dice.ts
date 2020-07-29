import {NaiveBroadphase, World} from 'cannon-es';
import {
  AmbientLight,
  CameraHelper,
  Color,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
// import {} from 'threejs-dice-typescript';
import {DiceItem} from './my-roller';
import {DiceD4} from '@views/home/dice/dice-d4';

export class MyDice {

  private readonly scene = new Scene();
  // @ts-ignore
  private camera;
  private canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
  // @ts-ignore
  private renderer;
  private world: World;

  private stats: Stats;

  private dice: any[] = [];

  public diceThrow: (values: DiceItem[]) => void;

  constructor() {

    const SCREEN_WIDTH = window.innerWidth;
    const SCREEN_HEIGHT = window.innerHeight;
    const VIEW_ANGLE = 45;
    const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    const NEAR = 0.01;
    const FAR = 20000;

    this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(0, 30, 30);

    // RENDERER
    this.renderer = new WebGLRenderer({antialias: true, canvas: this.canvas});
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    const cameraPerspectiveHelper = new CameraHelper(this.camera);
    this.scene.add(cameraPerspectiveHelper);

    // EVENTS
    // CONTROLS
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.stats = this.getStats();

    this.scene.background = new Color(0x2FA1D6);
    this.camera.position.set(0, 50, 0);
    const lookAt = new Vector3(0, 0, 0);
    this.camera.lookAt(lookAt);

    this.light();

    // FLOOR
    const floorMaterial = new MeshPhongMaterial({color: '#ff0000', side: DoubleSide, visible: false});
    const floorGeometry = new PlaneGeometry(30, 30, 10, 10);
    const floor = new Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.rotation.x = Math.PI / 2;
    this.scene.add(floor);

    this.world = new World();
    this.world.gravity.set(0, -10 * 20, 0);
    this.world.broadphase = new NaiveBroadphase();
    // this.world.solver.iterations = 16;

    // const diceManager = new DiceManager(this.world);

    // Floor
    // const floorBody = new Body({mass: 0, shape: new Plane(), material: diceManager.floorBodyMaterial});
    // floorBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
    // (this.world as any).add(floorBody);

    const dicesMap: { [key: number]: { clazz: any, color: string } } = {
      4: {clazz: DiceD4, color: '#ff0000'}
    };

    const removeall = () => {
      const objs = this.dice.map((dice: any) => dice.getObject() as Object3D);
      this.scene.remove(...objs);
      this.dice = [];
    };

    const diceThrow = (values: DiceItem[]) => {
      removeall();
      this.dice = values.map((value, index) => {
        // recupero l'oggetto che contiene classe e colore per la creazione del dado
        const conf = dicesMap[value.d as number];
        const die = new conf.clazz({size: 1.5, backColor: conf.color}, this.world);
        this.scene.add(die.getObject());
        // @ts-ignore
        return die;
      });

      const diceValues = [];
      for (let i = 0; i < this.dice.length; i++) {
        const yRand = Math.random() * 20;
        const dice: any = (this.dice[i] as any);
        const obj: any = dice.getObject();

        obj.position.x = 0;
        obj.position.y = 2 + Math.floor(i / 3) * 1.5;
        obj.position.z = 20 + (i % 3) * 1.5;
        obj.quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
        obj.quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;
        dice.updateBodyFromMesh();
        const rand = Math.random() * 5;
        obj.body.velocity.set(0, 40 + yRand, -40 + rand);
        obj.body.angularVelocity.set(30 * Math.random() - 10, 30 * Math.random() - 10, 30 * Math.random() - 10);

        diceValues.push({dice: this.dice[i], value: 1});
      }
      // diceManager.prepareValues(diceValues);
    };
    this.diceThrow = diceThrow;
    // setInterval(randomDiceThrow, 4000);
    // randomDiceThrow();

    // @ts-ignore
    const render = (time: number) => {
      this.world.step(1.0 / 60.0);
      this.dice.forEach((value) => {
        setTimeout((value as any).updateMeshFromBody(), 200);
      });
      this.adjustCanvasSize();
      this.renderer.render(this.scene, this.camera);
      this.stats.update();
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private getStats() {
    // @ts-ignore
    const stats = new Stats();
    stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
  }

  private light() {
    const ambient = new AmbientLight(0xefdfd5, 0.8);
    this.scene.add(ambient);

    const directionalLight = new DirectionalLight(0xefdfd5, 0.5);
    directionalLight.position.x = -1000;
    directionalLight.position.y = 1000;
    directionalLight.position.z = 1000;
    this.scene.add(directionalLight);
    //
    const light = new SpotLight(0xefdfd5, 0.1);
    light.position.y = 100;
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 110;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);
  }
}
