import {Vector3} from 'three';

export class VectorUtils {

  private x: number;
  private y: number;
  private boost: Vector3;

  /**
   *
   * @param width dimensione del piano ricavato in base alla posizione della telecamera.
   * @param height dimensione del piano ricavato in base alla posizione della telecamera.
   */
  constructor(
    private readonly width: number,
    private readonly height: number,
  ) {
    const x = (this.rnd() * 2 - 1) * width;
    const y = -(this.rnd() * 2 - 1) * height;

    const dist = Math.sqrt(x * x + y * y);

    const getBoost = (value) => {
      return (this.rnd() + 3) * value;
    };

    const boost = new Vector3(getBoost(dist), 1, getBoost(dist));

    this.x = x;
    this.y = y;
    this.boost = boost;
  }

  rnd() {
    const result = Math.random();
    return result;
  }

  generate_vector(inertia = 1): DiceVector {

    const {width, height, boost} = this;
    const xA = (width / 2) * 0.9;
    const yA = this.rnd() * 200 + 200;
    const zA = (height / 2) * 0.9;
    const pos = new Vector3(xA, yA, zA);

    const zero = new Vector3(0, 0, 0);

    const velocity = new Vector3()
      .subVectors(zero, pos)
      .multiply(new Vector3(inertia, 1, inertia));

    const aMultiply = (10 * inertia);
    const angle = new Vector3().random().multiply(new Vector3(aMultiply, aMultiply, aMultiply));

    const axis = new Vector3().random();
    const a = this.rnd();
    return {pos, velocity, angle, axis, a};
  }

}

export class DiceVector {
  public pos: Vector3; // capire il tipo di classe da usare
  public velocity: Vector3; // capire il tipo di classe da usare
  public angle: Vector3; // capire il tipo di classe da usare
  public axis: Vector3; // capire il tipo di classe da usare
  public a: number;
}
