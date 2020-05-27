import {AfterContentInit, ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fabric} from 'fabric';
import {debounce} from '@core/utils/j-utils';
import {select, Store} from '@ngrx/store';
import {FabricObjStoreActions, FabricObjStoreSelectors, RootStoreState, SlideMenuStoreSelectors} from '@root-store/index';
import {debounceTime, distinctUntilChanged, map, pairwise, startWith} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Point} from 'fabric/fabric-impl';
import * as _ from 'lodash';
import {FabricObj, randomFabricObj} from '@models/vo/fabric-obj';

@Component({
  selector: 'app-my-fabric-main',
  template: `
    <div #container class="h-100 w-100">
      <div class="tools">
        <em class="tool fa-button fas fa-project-diagram fa-2x p-2" (click)="newRectagle()"></em>
        <em class="tool fa-button fas fa-project-diagram fa-2x p-2"></em>
        <em class="tool fa-button fas fa-project-diagram fa-2x p-2"></em>
        <em class="tool fa-button fas fa-project-diagram fa-2x p-2"></em>
        <em class="tool fa-button fas fa-project-diagram fa-2x p-2"></em>
      </div>
      <canvas id="canvas"></canvas>
    </div>
  `,
  styles: [`
    #canvas {
      border: solid 2px #6c757d;
    }

    .tools {
      width: 200px;
      height: 200px;
      border: solid #999999 1px;
    }

    .tool {
      color: #6d6d6d;
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyFabricMainComponent implements OnInit, OnDestroy, AfterContentInit {

  slideMenuOpen: Subscription;
  canvas: fabric.Canvas;
  @ViewChild('container', {static: true}) container;

  constructor(private readonly store$: Store<RootStoreState.State>) {
    // console.log('el', el);
  }

  calculateSize: (canvas) => void = debounce((canvas) => {
    console.log('.calculateSize()');
    const {left, top} = this.container.nativeElement.getBoundingClientRect();
    const footerHeight = 24;
    const footerRight = 4;
    const height = window.innerHeight - top - footerHeight;
    const width = window.innerWidth - left - footerRight;
    canvas.setDimensions({height, width});
    this.setGrid(this.canvas, {width: 800, height: 600});
  }, 100, false);

  setGrid = _.memoize((canvas, {width, height}, gridSize = 32, lineStroke = '#C5C9CB') => {
    const count = Math.ceil((width / gridSize)) + 1;
    for (let i = 0; i < count; i++) {
      const lineX = new fabric.Line([0, i * gridSize, width, i * gridSize], {
        stroke: lineStroke,
        selectable: false,
        type: 'line'
      });
      const lineY = new fabric.Line([i * gridSize, 0, i * gridSize, width], {
        stroke: lineStroke,
        selectable: false,
        type: 'line'
      });
      canvas.add(lineX);
      canvas.add(lineY);
    }
  }, ({width, height}) => {
    return `size${width}${height}`;
  });

  ngOnInit() {
    // Save additional attributes in Serialization
    fabric.Object.prototype.toObject = (function(toObject) {
      return function(properties) {
        return fabric.util.object.extend(toObject.call(this, properties), {
          id: this.id
        });
      };
    })(fabric.Object.prototype.toObject);
    // console.log('MyFabricMainComponent.ngOnInit()');
  }

  ngOnDestroy(): void {
    this.slideMenuOpen.unsubscribe();
  }

  ngAfterContentInit(): void {
    console.log('MyFabricMainComponent.ngAfterContentInit()');
    this.canvas = new fabric.Canvas('canvas', {backgroundColor: '#f3f3f3'});
    this.calculateSize(this.canvas);

    this.setPan(this.canvas);
    this.setZoom(this.canvas);
    this.setEdit(this.canvas);

    // this.canvas.add(
    //  new fabric.Rect({
    //   left: 64,
    //   top: 64,
    //   fill: 'red',
    //   width: 32,
    //   height: 32
    // }));

    // this.canvas.add(
    //   new fabric.Rect({
    //     left: 64,
    //     top: 64,
    //     fill: 'red',
    //     width: 32,
    //     height: 32
    //   })
    // );

    console.log(JSON.stringify(this.canvas));

    const obj = {
      version: '3.6.3',
      objects: [],
      background: '#f3f3f3'
    };

    this.store$.pipe(
      select(FabricObjStoreSelectors.selectAll),
      startWith([]), // emitting first empty value to fill-in the buffer
      pairwise(),
      map(([previousValue, currentValue]) => {

        const previousValueE = previousValue.reduce((prev, curr) => ({...prev, [curr.id]: curr}), new FabricObj());
        currentValue.forEach(item => {
          const result = (previousValueE[item.id] === item);
          console.log('item.id: ' + item.id + result);
        });
        return currentValue;
      }),
      map(objects => ({...obj, objects}))
    ).subscribe(
      next => {
        this.canvas.loadFromJSON(next, null, null);
        const result = this.canvas.getObjects().filter(
          value => !!value['id']
        ).map(value => value['id']);
        console.log('result', result);
      }
    );

    this.store$.dispatch(FabricObjStoreActions.SearchRequest({queryParams: {}}));

    this.slideMenuOpen = this.store$.pipe(select(SlideMenuStoreSelectors.selectOpen))
      .pipe(
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe(next => {
        this.calculateSize(this.canvas);
      });
  }

  setEdit(canvas) {
    canvas.on({
      'object:moving': (e) => {
        e.target.opacity = 0.5;
      },
      'object:modified': (e) => {
        console.log('MyFabricMainComponent.object:modified()');
        console.log('e', e);
        e.target.opacity = 1;
        const item = e.target.toJSON();
        this.store$.dispatch(FabricObjStoreActions.EditRequest({item}));
      }
    });
  }

  setZoom(canvas) {
    canvas.on('mouse:wheel', (opt: any) => {
      const delta = opt.e.deltaY;
      const pointer = canvas.getPointer(opt.e);
      let zoom = canvas.getZoom();
      zoom = zoom + delta / 200;
      if (zoom > 20) {
        zoom = 20;
      }
      if (zoom < 0.01) {
        zoom = 0.01;
      }
      const x: number = opt.e.offsetX;
      const y: number = opt.e.offsetY;
      canvas.zoomToPoint({x, y} as Point, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  }

  setPan(canvas) {
    let lastPosX;
    let lastPosY;
    let isDragging = false;
    let selection = true;

    canvas.on('mouse:down', (opt: any) => {
      // console.log('mouse:down.()');
      const evt = opt.e;
      if (evt.altKey === true) {
        console.log('evt.altKey', evt.altKey);
        isDragging = true;
        selection = false;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
      }
    });

    canvas.on('mouse:move', (opt: any) => {
      // console.log('mouse:move.()');
      if (isDragging) {
        const e = opt.e;
        canvas.viewportTransform[4] += e.clientX - lastPosX;
        canvas.viewportTransform[5] += e.clientY - lastPosY;
        canvas.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    });

    canvas.on('mouse:up', (opt) => {
      // console.log('mouse:up.()');
      isDragging = false;
      selection = true;
    });
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // console.log('MyFabricMainComponent.onResize()');
    this.calculateSize(this.canvas);
  }

  newRectagle() {
    const item = randomFabricObj();
    this.store$.dispatch(FabricObjStoreActions.CreateRequest({item}));
  }

}


