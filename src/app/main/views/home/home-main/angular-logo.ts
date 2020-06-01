import {BoxGeometry, Color, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';

export class AngularLogo {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(60, 2, 5, 1000);
  private canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: this.canvas,
  });

  private mesh: Mesh;

  constructor() {

    const geometry = new BoxGeometry(300, 300, 300);
    const material = new MeshStandardMaterial({color: 0xFF0000});

    this.mesh = new Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.scene.background = new Color(0x2FA1D6);
    this.camera.position.set(400, 65, 400);
    const lookAt = new Vector3(0, -80, 0);
    this.camera.lookAt(lookAt);

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

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
    this.adjustCanvasSize();
  }
}
