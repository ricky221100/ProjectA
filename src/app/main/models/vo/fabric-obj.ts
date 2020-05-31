export class FabricObj {
  public id: string = undefined;

  [key: string]: any;

  /**
   * metodo statico utilizzato per recuperare l'id dell'entita.
   * @param item
   */
  static selectId: (item: FabricObj) => string = item => item.id;
}

export function rantomPartialRect() {
  return {
    left: random(10, 200),
    top: random(10, 200),
    width: random(10, 50),
    height: random(10, 50),
    fill: randomColor()
  };
}

export function randomFabricObj(id = null): FabricObj {
  return {
    id,
    type: 'rect',
    // version: '3.6.3',
    // originX: 'left',
    // originY: 'top',
    left: random(10, 200),
    top: random(10, 200),
    width: random(10, 50),
    height: random(10, 50),
    fill: randomColor(),
    // stroke: null,
    // strokeWidth: 1,
    // strokeDashArray: null,
    // strokeLineCap: 'butt',
    // strokeDashOffset: 0,
    // strokeLineJoin: 'miter',
    // strokeMiterLimit: 4,
    // scaleX: 1,
    // scaleY: 1,
    // angle: 0,
    // flipX: false,
    // flipY: false,
    // opacity: 1,
    // shadow: null,
    // visible: true,
    // clipTo: null,
    // backgroundColor: '',
    // fillRule: 'nonzero',
    // paintFirst: 'fill',
    // globalCompositeOperation: 'source-over',
    // transformMatrix: null,
    // skewX: 0,
    // skewY: 0,
    // rx: 0,
    // ry: 0
  };
}

export function random(min, max) {
  return Math.floor((Math.random() * (max - min)) + min);
}

export const letters = '0123456789ABCDEF';

export function randomColor() {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getPartial(item) {
  return (({
             left,
             top,
             width,
             height,
             fill,

             opacity,
             stroke,
             strokeWidth,
             scaleX,
             scaleY,
             angle,
             flipX,
             flipY,
             skewX,
             skewY
           }) => ({
    left,
    top,
    width,
    height,
    fill,
    opacity,
    stroke,
    strokeWidth,
    scaleX,
    scaleY,
    angle,
    flipX,
    flipY,
    skewX,
    skewY
  }))(item);
}

// Fabric è più performate se modifico solo gli attributi effettivamente modificati.
// Quindi ricavo la differenza degli oggetti
// per rendere questa procedura più performante utilizzo:
// - basePartial, con gli attributi minimi per il controllo
// - keys con l'elenco degli attributi da controllare
export function getDifference(previousA, currentA): FabricObj {
  console.log('getDifference.getDifference()');
  const previous = {...basePartial, ...previousA};
  const current = {...basePartial, ...currentA};

  return keys.reduce((prev, currKey) => {
    // sel'attributo è differente, lo aggiungo al reducer
    if (previous[currKey] !== current[currKey]) {
      return {...prev, [currKey]: current[currKey]};
    }
    return prev;
  }, {id: currentA.id});
}

// questo oggetto mi serve per poter mergiare l'item che devo cmparare,
// in modo da avere tutti gli attributi minimi necessari.
// ad esempio:
// itemAFroCompare = {...basePartial, itemA}
// itemBFroCompare = {...basePartial, itemB}

const basePartial = {
  left: null,
  top: null,
  width: null,
  height: null,
  fill: null,
  opacity: null,
  stroke: null,
  strokeWidth: null,
  scaleX: null,
  scaleY: null,
  angle: null,
  flipX: null,
  flipY: null,
  skewX: null,
  skewY: null
};

const keys = ['left',
  'top',
  'width',
  'height',
  'fill',
  'opacity',
  'stroke',
  'strokeWidth',
  'scaleX',
  'scaleY',
  'angle',
  'flipX',
  'flipY',
  'skewX',
  'skewY'];

