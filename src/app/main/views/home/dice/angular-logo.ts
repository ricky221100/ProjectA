import {GUI} from 'dat.gui';
import {gsap} from 'gsap';
import {
  BoxGeometry,
  Color,
  DirectionalLight,
  Font,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TextGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import {jsonData} from './font';
import DEG2RAD = MathUtils.DEG2RAD;

export class AngularLogo {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(60, 2, 5, 1000);
  private canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: this.canvas,
  });

  private mesh: Mesh;
  private stats: Stats;

  constructor() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.autoRotate = false;
    controls.update();

    // const cameraPerspectiveHelper = new CameraHelper(this.camera);
    // this.scene.add(cameraPerspectiveHelper);

    this.stats = this.getStats();

    const geometry = new BoxGeometry(300, 300, 300);
    const material = new MeshStandardMaterial({color: 0xFF0000});

    this.mesh = new Mesh(geometry, material);
    this.scene.add(this.mesh);

    // const A = this.text('A');
    // A.position.x = 237;
    // A.position.y = -3;
    // A.position.z = 300;
    // A.rotateY(0.8)
    // this.scene.add(A);

    const A = this.text('A');
    A.position.x = 22;
    A.position.y = -73;
    A.position.z = 145;
    A.rotateY(0.8);
    this.scene.add(A);

    this.scene.background = new Color(0x2FA1D6);
    this.camera.position.set(400, 65, 400);
    const lookAt = new Vector3(0, -80, 0);
    this.camera.lookAt(lookAt);
    const tl = gsap.timeline();
    tl
      .from(this.mesh.scale, {duration: 5, x: 0.001, y: 0.001, z: 0.001})
      .from(this.mesh.rotation, {duration: 5, x: 3600 * DEG2RAD, z: 3600 * DEG2RAD}, '<')
      .from(A.position, {duration: 3, y: 120, x: 400, z: 500}, '-=3');

    // tl.to(this.brickA.rotation, {duration: 2, y: 360 * DEG2RAD, ease: 'elastic.out(1, 0.5)'})
    // tl.to(this.brickA.scale, {duration: 3, x: 2, y: 2, z: 2, ease: 'elastic.out(1, 0.5)'});
    //   .call(() => this.scene.add(this.brickB))
    //   .to(this.brickB.scale, {duration: 2, x: 100, y: 100, z: 100, ease: 'elastic.out(1, 0.5)'})
    // .to(this.brickB.position, {duration: 1, y: 100})
    // .to(this.brickB.position, {duration: 1, z: 100})
    // .to(this.brickB.scale, {duration: 2, x: 3, ease: 'elastic.out(1, 0.5)'})
    // .to(this.brickB.scale, {duration: 2, z: 3, ease: 'elastic.out(1, 0.5)'})
    // .call(() => tl.restart());

    const gui = new GUI();

    gui.remember(this.camera.position);

    const aRotationFolder = gui.addFolder('A rotation');
    aRotationFolder.add(A.rotation, 'x', -2, 2, 0.01);
    aRotationFolder.add(A.rotation, 'y', -2, 2, 0.01);
    aRotationFolder.add(A.rotation, 'z', -2, 2, 0.01);
    aRotationFolder.open();

    const aPositionFolder = gui.addFolder('A Position');
    const rangeAA = 500;
    aPositionFolder.add(A.position, 'x', -rangeAA, rangeAA, 1);
    aPositionFolder.add(A.position, 'y', -rangeAA, rangeAA, 1);
    aPositionFolder.add(A.position, 'z', -rangeAA, rangeAA, 1);
    aPositionFolder.open();

    const rangeR = 500;
    const cubeRotationFolder = gui.addFolder('Cube rotation');
    cubeRotationFolder.add(this.mesh.rotation, 'x', -2, 2, 0.01);
    cubeRotationFolder.add(this.mesh.rotation, 'y', -2, 2, 0.01);
    cubeRotationFolder.add(this.mesh.rotation, 'z', -2, 2, 0.01);
    cubeRotationFolder.open();

    const cameraFolder = gui.addFolder('Camera');
    const rangeA = 500;
    cameraFolder.add(this.camera.position, 'x', -rangeA, rangeA, 1);
    cameraFolder.add(this.camera.position, 'y', -rangeA, rangeA, 1);
    cameraFolder.add(this.camera.position, 'z', -rangeA, rangeA, 1);
    cameraFolder.open();

    const onChangeLookAt = () => this.camera.lookAt(lookAt);

    const range = 200;
    const lookAtFolderFolder = gui.addFolder('Look at');
    lookAtFolderFolder.add(lookAt, 'x', -range, range, 1).onChange(onChangeLookAt);
    lookAtFolderFolder.add(lookAt, 'y', -range, range, 1).onChange(onChangeLookAt);
    lookAtFolderFolder.add(lookAt, 'z', -range, range, 1).onChange(onChangeLookAt);
    lookAtFolderFolder.open();

    this.light();
    /**
     * Y verde
     * X blu
     * Z rosso
     */
    // const axis = new AxesHelper(200);
    // this.scene.add(axis);

    this.renderer.setSize(100, 100);
    this.renderer.setClearColor(new Color('rgb(0,200,0)'));

    this.render();
  }

  public light() {
    const light = new DirectionalLight(0xffffff, 1.8);
    light.position.set(20, 100, 60);
    this.scene.add(light);

    const backLight = new DirectionalLight(0xffffff, 1);
    backLight.position.set(20, 100, -40);
    this.scene.add(backLight);
  }

  private getStats() {
    // @ts-ignore
    const stats = new Stats();
    stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private text(text: string) {
    const font: Font = new Font(jsonData);

    const geometry = new TextGeometry(text, {
      font,
      size: 190,
      height: 100,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 3,
      bevelOffset: 0,
      bevelSegments: 0,
    });

    const material = new MeshBasicMaterial({color: 0xFFFFFF});
    const result = new Mesh(geometry, material);
    return result;
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
    this.adjustCanvasSize();
    this.stats.update();
  }
}
