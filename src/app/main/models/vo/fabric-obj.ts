export class FabricObj {
  public id: string = undefined;

  [key: string]: any;

  /**
   * metodo statico utilizzato per recuperare l'id dell'entita.
   * @param item
   */
  static selectId: (item: FabricObj) => string = item => item.id;
}


export function randomFabricObj(id = null): FabricObj {
  return {
    id,
    type: 'rect',
    version: '3.6.3',
    originX: 'left',
    originY: 'top',
    left: random(10, 200),
    top: random(10, 200),
    width: random(10, 50),
    height: random(10, 50),
    fill: randomColor(),
    stroke: null,
    strokeWidth: 1,
    strokeDashArray: null,
    strokeLineCap: 'butt',
    strokeDashOffset: 0,
    strokeLineJoin: 'miter',
    strokeMiterLimit: 4,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    flipX: false,
    flipY: false,
    opacity: 1,
    shadow: null,
    visible: true,
    clipTo: null,
    backgroundColor: '',
    fillRule: 'nonzero',
    paintFirst: 'fill',
    globalCompositeOperation: 'source-over',
    transformMatrix: null,
    skewX: 0,
    skewY: 0,
    rx: 0,
    ry: 0
  };
}

export function random(min, max) {
  return Math.floor((Math.random() * (max - min)) + min);
}

export const letters = '0123456789ABCDEF';

function randomColor() {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
