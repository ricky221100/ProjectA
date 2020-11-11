import {
  AmbientLight,
  Mesh,
  MeshPhongMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SpotLight,
  WebGLRenderer
} from 'three';
import {ContactMaterial, Material, NaiveBroadphase, World} from 'cannon-es';
import {MeshPhongMaterialParameters} from 'three/src/materials/MeshPhongMaterial';
import {DiceD4} from '@views/home/dice/dice-d4';

export class DiceBox {
  private use_adapvite_timestep: boolean;
  private animate_selector: boolean;
  private dices: any[];
  private scene: Scene;
  private world: World;
  private renderer: WebGLRenderer;
  private ambient_light_color = 0xf0f5fb;
  private dice_body_material: Material;
  private last_time: number;
  private running: boolean;
  private light;
  private cw: number;
  private w: number;
  private h: number;
  private ch: number;
  private scale: number;
  private aspect: number;
  private wh: number;
  private camera: any;
  private spot_light_color = 0xefdfd5;
  private desk: any;
  private use_shadows = true;
  private desk_color = 0xdfdfdf;

  private random_storage = [];
  private dice_inertia = { d4: 5, d6: 13, d8: 10, d10: 9, d12: 8, d20: 6, d100: 9 };


  constructor() {
    const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    this.init(canvas, {w: 500, h: 300});
  }

  init(canvas, dimentions) {
    this.use_adapvite_timestep = true;
    this.animate_selector = true;

    this.dices = [];
    this.scene = new Scene();
    this.world = new World();

    this.renderer = new WebGLRenderer({canvas, antialias: true});

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    this.renderer.setClearColor(0xffffff, 1);

    this.reinit(canvas, dimentions);

    this.world.gravity.set(0, 0, -9.8 * 800);
    this.world.broadphase = new NaiveBroadphase();
    // this.world.solver.iterations = 16;

    const ambientLight = new AmbientLight(this.ambient_light_color);
    this.scene.add(ambientLight);

    const dice = new DiceD4();
    this.scene.add(dice);
    this.dice_body_material = new Material('dice_body_material');
    const desk_body_material = new Material('desk_body_material');
    const barrier_body_material = new Material('barrier_body_material');


    this.world.addContactMaterial(new ContactMaterial(
      desk_body_material, this.dice_body_material, {friction: 0.01, restitution: 0.5}));

    this.world.addContactMaterial(new ContactMaterial(
      barrier_body_material, this.dice_body_material, {friction: 0, restitution: 1.0}));

    this.world.addContactMaterial(new ContactMaterial(
      this.dice_body_material, this.dice_body_material, {friction: 0, restitution: 0.5}));

    // this.world.addBody(new RigidBody(0, new Plane(), desk_body_material, this.manager));
    // let barrier;
    // barrier = new RigidBody(0, new Plane(), barrier_body_material, this.manager);
    // barrier.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
    // barrier.position.set(0, this.h * 0.93, 0);
    // this.world.addBody(barrier);
    //
    // barrier = new RigidBody(0, new Plane(), barrier_body_material, this.manager);
    // barrier.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
    // barrier.position.set(0, -this.h * 0.93, 0);
    // this.world.addBody(barrier);
    //
    // barrier = new RigidBody(0, new Plane(), barrier_body_material, this.manager);
    // barrier.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), -Math.PI / 2);
    // barrier.position.set(this.w * 0.93, 0, 0);
    // this.world.addBody(barrier);
    //
    // barrier = new RigidBody(0, new Plane(), barrier_body_material, this.manager);
    // barrier.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
    // barrier.position.set(-this.w * 0.93, 0, 0);
    // this.world.addBody(barrier);

    this.last_time = 0;
    this.running = false;
    this.adjustCanvasSize();
    this.renderer.render(this.scene, this.camera);
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  reinit(container, dimentions) {
    // console.log('0xdfdfdf', 0xdfdfdf);
    this.cw = container.clientWidth / 2;
    this.cw = container.clientHeight / 2;
    if (dimentions) {
      this.w = dimentions.w;
      this.h = dimentions.h;
    } else {
      this.w = this.cw;
      this.h = this.ch;
    }
    this.aspect = Math.min(this.cw / this.w, this.ch / this.h);
    this.scale = Math.sqrt(this.w * this.w + this.h * this.h) / 13;

    this.renderer.setSize(this.cw * 2, this.ch * 2);

    this.wh = this.ch / this.aspect / Math.tan(10 * Math.PI / 180);
    if (this.camera) {
      this.scene.remove(this.camera);
    }
    this.camera = this.getCamera(this.cw, this.ch, this.wh);

    const mw = Math.max(this.w, this.h);
    if (this.light) {
      this.scene.remove(this.light);
    }

    this.light = this.getLight(mw);
    this.scene.add(this.light);

    if (this.desk) {
      this.scene.remove(this.desk);
    }

    this.desk = this.getDesk(this.desk_color, this.w, this.h);
    this.scene.add(this.desk);

    this.renderer.render(this.scene, this.camera);
  }

  getCamera(cw, ch, wh) {
    const result = new PerspectiveCamera(20, cw / ch, 1, wh * 1.3);
    result.position.z = wh;
    return result;
  }

  getDesk(desk_color: number, width: number, height: number) {
    const parameters: MeshPhongMaterialParameters = {color: desk_color};
    const desk = new Mesh(
      new PlaneGeometry(width * 2, height * 2, 1, 1),
      new MeshPhongMaterial(parameters)
    );
    desk.receiveShadow = this.use_shadows;
    return desk;
  }

  getLight(mw) {
    const light: SpotLight = new SpotLight(this.spot_light_color, 2.0);
    light.position.set(-mw / 2, mw / 2, mw * 2);
    light.target.position.set(0, 0, 0);
    light.distance = mw * 5;
    light.castShadow = true;
    light.shadow.camera.near = mw / 10;
    light.shadow.camera.far = mw * 5;
    light.shadow.camera.fov = 50;
    light.shadow.bias = 0.001;
    // light.shadow.darkness = 1.1;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    return light;
  }

  rnd() {
    return this.random_storage.length ? this.random_storage.pop() : Math.random();
  }

  make_random_vector(vector) {
    const random_angle = this.rnd() * Math.PI / 5 - Math.PI / 5 / 2;
    const vec = {
      x: vector.x * Math.cos(random_angle) - vector.y * Math.sin(random_angle),
      y: vector.x * Math.sin(random_angle) + vector.y * Math.cos(random_angle)
    };
    // tslint:disable-next-line:triple-equals
    if (vec.x == 0) {
      vec.x = 0.01;
    }
    // tslint:disable-next-line:triple-equals
    if (vec.y == 0) {
      vec.y = 0.01;
    }
    return vec;
  }

  generate_vectors(notation, vector, boost) {
    const vectors = [];
    for (const i in notation.set) {
      const vec = this.make_random_vector(vector);
      const pos = {
        x: this.w * (vec.x > 0 ? -1 : 1) * 0.9,
        y: this.h * (vec.y > 0 ? -1 : 1) * 0.9,
        z: this.rnd() * 200 + 200
      };
      const projector = Math.abs(vec.x / vec.y);
      if (projector > 1.0) {
        pos.y /= projector;
      } else {
        pos.x *= projector;
      }
      const velvec = this.make_random_vector(vector);
      const velocity = {x: velvec.x * boost, y: velvec.y * boost, z: -10};
      const inertia = this.dice_inertia[notation.set[i]];
      const angle = {
        x: -(this.rnd() * vec.y * 5 + inertia * vec.y),
        y: this.rnd() * vec.x * 5 + inertia * vec.x,
        z: 0
      };
      const axis = {x: this.rnd(), y: this.rnd(), z: this.rnd(), a: this.rnd()};
      vectors.push({set: notation.set[i], pos, velocity, angle, axis});
    }
    return vectors;
  }



}
