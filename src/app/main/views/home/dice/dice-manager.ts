import {
  AxesHelper,
  Color,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import {DiceD4} from './dice-d4';
import {DicePhysics} from './dice-physics';
import {DiceVector, VectorUtils} from '@views/home/dice/vector-utils';
import {GUI} from 'dat.gui';
import {visibleAtDepth} from '@views/home/dice/threejs-utils';


export class DiceManager {

  private readonly diceMap = {
    d4: {inertia: 2, clazz: DiceD4},
    d6: {inertia: 13, clazz: DiceD4},
    d8: {inertia: 10, clazz: DiceD4},
    d10: {inertia: 9, clazz: DiceD4},
    d12: {inertia: 8, clazz: DiceD4},
    d20: {inertia: 6, clazz: DiceD4},
    d100: {inertia: 9, clazz: DiceD4}
  };
  private readonly depth = 5000;
  private readonly wallHeight = 100;
  private readonly physics = new DicePhysics();
  private readonly scene = new Scene();
  private readonly camera: PerspectiveCamera;
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: WebGLRenderer;

  private stats: Stats;

  constructor() {

    this.camera = new PerspectiveCamera(8, 2, this.depth - 500, this.depth + 500);
    this.canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.renderer.setSize(2000, 2000, true);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.autoRotate = false;
    controls.update();

    this.stats = this.getStats();

    this.scene.background = new Color(0x2FA1D6);

    this.camera.position.set(0, this.depth, 0);
    const lookAt = new Vector3(0, 0, 0);
    this.camera.lookAt(lookAt);

    const plane = this.getPlane(1, 1, 0xFFFF00);
    let rect = visibleAtDepth(this.depth, this.camera);
    plane.scale.set(rect.width, rect.height, 1);

    this.scene.add(plane);
    this.physics.addMesh(plane);

    const wall = this.getWall(200, this.wallHeight);
    wall.position.setX(500);
    wall.position.setY(500);
    wall.rotateX(2);

    this.scene.add(wall);
    this.physics.addMesh(wall);

    //
    this.scene.add(...this.getLight());


    // let temp = this.depth;
    // todo: in fase di sviluppo. ricalcolo le dimensioni dopo che viene renderizzato il componente.
    setTimeout(() => {
      rect = visibleAtDepth(this.depth, this.camera);
      plane.scale.set(rect.width, rect.height, 1);
      this.roll(rect.width, rect.height, this.diceMap.d4.inertia);
    }, 1000);


    /**
     * Y verde
     * X blu
     * Z rosso
     */
    const axis = new AxesHelper(200);
    this.scene.add(axis);

    this.makeGui(this.camera);
    this.render();
  }

  roll(width: number,
       height: number,
       inertia: number) {

    const dice = new DiceD4();
    dice.castShadow = true;
    dice.receiveShadow = true;

    this.scene.add(dice);
    this.physics.addMesh(dice, 10);

    const {pos, angle, velocity}: DiceVector = new VectorUtils(width, height).generate_vector(inertia);
    // pos.setZ(0);
    // pos.setY(50);
    // velocity.setY(50);

    // pos.setX(0);

    // const vectorA = new Vector3(pos.x, 50, pos.z);
    // const vectorB = new Vector3(0, 50, 0);
    // const vectorC = new Vector3().subVectors(vectorB, vectorA);

    const diceVector: DiceVector = {
      a: 3,
      // pos: {x: 0, y: 50, z: 100},
      // pos: vectorA,
      pos,
      angle,
      // angle: {x: 10, y: 0, z: 10},
      velocity,
      // velocity: vectorC,
      // axis: {x: 10, y: 10, z: 10},
    } as DiceVector;
    this.physics.setDiceVector(dice, diceVector);

    // const diceB = new DiceD4();
    // diceB.castShadow = true;
    // diceB.receiveShadow = true;
    //
    // this.scene.add(diceB);
    // this.physics.addMesh(diceB, 100);
    //
    // const diceVectorB: DiceVector = {
    //   a: 3,
    //   // pos: {x: 0, y: 50, z: 100},
    //   pos: vectorC,
    //   // pos,
    //   // angle,
    //   // angle: {x: 100, y: 0, z: 100},
    //   // velocity,
    //   // velocity: vectorC,
    //   // axis: {x: 10, y: 10, z: 10},
    // } as DiceVector;
    // this.physics.setDiceVector(diceB, diceVectorB);
  }

  private adjustCanvasSize() {
    // console.log('DiceManager.adjustCanvasSize()');
    this.renderer.setSize(innerWidth, innerHeight);
    const aspect = innerWidth / innerHeight;
    // console.log('aspect', aspect);
    // this.adjustPlaneSize();
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  public getWall(width: number, height: number) {
    const plane = new Mesh(
      new PlaneBufferGeometry(width, height),
      new MeshBasicMaterial({color: 0x000000})
    );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    return plane;
  }

  public getPlane(width: number, height: number, color: number) {
    const plane = new Mesh(
      new PlaneBufferGeometry(width, height),
      new MeshBasicMaterial({color})
    );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    return plane;
  }

  public getLight() {

    // var mw = Math.max(this.w, this.h);
    // if (this.light) this.scene.remove(this.light);
    // this.light = new THREE.SpotLight(that.spot_light_color, 2.0);
    // this.light.position.set(-mw / 2, mw / 2, mw * 2);
    // this.light.target.position.set(0, 0, 0);
    // this.light.distance = mw * 5;
    // this.light.castShadow = true;
    // this.light.shadowCameraNear = mw / 10;
    // this.light.shadowCameraFar = mw * 5;
    // this.light.shadowCameraFov = 50;
    // this.light.shadowBias = 0.001;
    // this.light.shadowDarkness = 1.1;
    // this.light.shadowMapWidth = 1024;
    // this.light.shadowMapHeight = 1024;
    // this.scene.add(this.light);

    const light = new DirectionalLight(0xffffff, 1.8);
    light.position.set(20, 100, 60);

    const backLight = new DirectionalLight(0xffffff, 1);
    backLight.position.set(20, 100, -40);

    return [light, backLight];
  }

  private getStats() {
    // @ts-ignore
    const stats = new Stats();
    stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    this.adjustCanvasSize();
    this.physics.step();
    this.stats.update();
    requestAnimationFrame(() => this.render());
  }

  makeGui(camera) {
    function updateCamera() {
      camera.updateProjectionMatrix();
    }

    const gui = new GUI();
    gui.remember(this.camera.position);
    const cameraFolder = gui.addFolder('Camera');
    const range = 10000;
    cameraFolder.add(camera.position, 'x', -range, range, 1);
    cameraFolder.add(camera.position, 'y', -range, range, 1);
    cameraFolder.add(camera.position, 'z', -range, range, 1);

    cameraFolder.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    cameraFolder.add(minMaxGUIHelper, 'min', 0.1, range, 0.1).name('near').onChange(updateCamera);
    cameraFolder.add(minMaxGUIHelper, 'max', 0.1, range, 0.1).name('far').onChange(updateCamera);
    cameraFolder.open();

  }
}

class MinMaxGUIHelper {
  constructor(private obj, private minProp, private maxProp, private minDif) {
  }

  get min() {
    return this.obj[this.minProp];
  }

  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }

  get max() {
    return this.obj[this.maxProp];
  }

  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;  // this will call the min setter
  }
}
