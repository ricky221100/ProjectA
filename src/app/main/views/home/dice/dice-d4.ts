import {Mesh, MeshPhongMaterial, Texture, Vector3} from 'three';
import {create_shape} from '@views/home/dice/cannon-utils';
import {calc_texture_size, create_geom, toVectors} from '@views/home/dice/threejs-utils';

export class DiceD4 extends Mesh {

  protected material_options = {
    specular: 0x172022,
    color: 0xf0f0f0,
    shininess: 40,
    flatShading: true,
  };

  protected label_color = '#FFFFFF';
  protected dice_color = '#202020';

  protected vertices = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]];
  protected faces: number[][] = [[1, 0, 2, 1], [0, 1, 3, 2], [0, 3, 2, 3], [1, 2, 3, 4]];

  public cannon_shape;

  constructor(scale = 50) {
    super();
    const radius: number = scale * 1.2;
    const vectors: Vector3[] = toVectors(this.vertices);
    this.cannon_shape = create_shape(vectors, this.faces, radius);
    this.geometry = this.create_d4_geometry(vectors, this.faces, radius);
    // this.geometry.type = 'DiceGeometry';
    this.material = this.create_d4_materials(scale / 2, scale * 2, this.d4_labels[0]);
  }

  public d4_labels = [
    [[], [0, 0, 0], [2, 4, 3], [1, 3, 4], [2, 1, 4], [1, 2, 3]],
    [[], [0, 0, 0], [2, 3, 4], [3, 1, 4], [2, 4, 1], [3, 2, 1]],
    [[], [0, 0, 0], [4, 3, 2], [3, 4, 1], [4, 2, 1], [3, 1, 2]],
    [[], [0, 0, 0], [4, 2, 3], [1, 4, 3], [4, 1, 2], [1, 3, 2]]
  ];

  create_d4_geometry(vectors, faces, radius) {
    return create_geom(vectors, faces, radius, -0.1, Math.PI * 7 / 6, 0.9);
  }

  create_d4_materials(size, margin, labels): MeshPhongMaterial[] {
    function create_d4_text(text, color, back_color) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const ts = calc_texture_size(size + margin) * 2;
      canvas.width = canvas.height = ts;
      context.font = (ts - margin) / 1.5 + 'pt Arial';
      context.fillStyle = back_color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = color;

      text.forEach((t) => {
        context.fillText(t, canvas.width / 2, canvas.height / 2 - ts * 0.3);
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(Math.PI * 2 / 3);
        context.translate(-canvas.width / 2, -canvas.height / 2);
      });

      const texture = new Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    return labels.map((label) => {
      const map = create_d4_text(label, this.label_color, this.dice_color);
      return new MeshPhongMaterial({...this.material_options, map});
    });
  }

}

