import {Body, Box, Plane, Quaternion, SAPBroadphase, Sphere, Vec3, World} from 'cannon-es';
import {Mesh} from 'three';
import {DiceVector} from '@views/home/dice/vector-utils';

/**
 * @author mrdoob / http://mrdoob.com/
 */
export function compose(position, quaternion, array, index) {

  const x = quaternion.x;
  const y = quaternion.y;
  const z = quaternion.z;
  const w = quaternion.w;
  const x2 = x + x;
  const y2 = y + y;
  const z2 = z + z;
  const xx = x * x2;
  const xy = x * y2;
  const xz = x * z2;
  const yy = y * y2;
  const yz = y * z2;
  const zz = z * z2;
  const wx = w * x2;
  const wy = w * y2;
  const wz = w * z2;

  array[index + 0] = (1 - (yy + zz));
  array[index + 1] = (xy + wz);
  array[index + 2] = (xz - wy);
  array[index + 3] = 0;

  array[index + 4] = (xy - wz);
  array[index + 5] = (1 - (xx + zz));
  array[index + 6] = (yz + wx);
  array[index + 7] = 0;

  array[index + 8] = (xz + wy);
  array[index + 9] = (yz - wx);
  array[index + 10] = (1 - (xx + yy));
  array[index + 11] = 0;

  array[index + 12] = position.x;
  array[index + 13] = position.y;
  array[index + 14] = position.z;
  array[index + 15] = 1;

}

export class DicePhysics {
  // world.solver.iterations = 20;
  // world.solver.tolerance = 0.001;
  // world.allowSleep = true;

  constructor() {
    this.world.gravity.set(0, -1000, 0);
    this.world.broadphase = new SAPBroadphase(this.world);
  }

  private lastTime = 0;

  private frameRate = 60;
  private frameTime = 1 / this.frameRate;

  private world = new World();

  private meshes = [];
  private meshMap = new WeakMap();


  private getShape(geometry) {

    const parameters = geometry.parameters;

    // TODO change type to is*

    switch (geometry.type) {

      case 'BoxBufferGeometry':
        const halfExtents = new Vec3();
        halfExtents.x = parameters.width !== undefined ? parameters.width / 2 : 0.5;
        halfExtents.y = parameters.height !== undefined ? parameters.height / 2 : 0.5;
        halfExtents.z = parameters.depth !== undefined ? parameters.depth / 2 : 0.5;
        return new Box(halfExtents);

      case 'PlaneBufferGeometry':
        return new Plane();

      case 'SphereBufferGeometry':
        const radius = parameters.radius;
        return new Sphere(radius);

    }
    return null;
  }

  public addMesh(mesh, mass = 0) {
    // console.log('DicePhysics.addMesh()');
    // devo trovare il modo di creare shape in questo punto e non all'interno del dado.
    const shape = mesh.cannon_shape || this.getShape(mesh.geometry);
    if (shape !== null) {
      if (mesh.isInstancedMesh) {
        this.handleInstancedMesh(mesh, mass, shape);
      } else if (mesh.isMesh) {
        this.handleMesh(mesh, mass, shape);
      }
    }
  }

  private handleMesh(mesh, mass, shape) {

    const position = new Vec3();
    position.copy(mesh.position);

    const quaternion = new Quaternion();
    quaternion.copy(mesh.quaternion);

    const body = new Body({
      position,
      quaternion,
      mass,
      shape
    });
    this.world.addBody(body);

    if (mass > 0) {
      this.meshes.push(mesh);
      this.meshMap.set(mesh, body);
    }

  }

  private handleInstancedMesh(mesh, mass, shape) {

    const array = mesh.instanceMatrix.array;

    const bodies = [];

    for (let i = 0; i < mesh.count; i++) {

      const index = i * 16;

      const position = new Vec3();
      position.set(array[index + 12], array[index + 13], array[index + 14]);

      const body = new Body({
        position,
        mass,
        shape
      });
      this.world.addBody(body);

      bodies.push(body);

    }

    if (mass > 0) {

      mesh.instanceMatrix.setUsage(35048); // THREE.DynamicDrawUsage = 35048
      this.meshes.push(mesh);

      this.meshMap.set(mesh, bodies);

    }

  }

  //
  // non sono sicuro che si chiami vector questo tipo di oggetto.
  // composto da tutti i parametri per lanciare i dadi.
  public setDiceVector(mesh: Mesh, vector: DiceVector) {
    const body = this.meshMap.get(mesh);
    if (!!vector.pos) {
      body.position.copy(vector.pos);
    }

    if (vector.axis) {
      body.quaternion.setFromAxisAngle(vector.axis, vector.a * Math.PI * 2);
    }

    if (vector.angle) {
      body.angularVelocity.set(vector.angle.x, vector.angle.y, vector.angle.z);
    }

    if (vector.velocity) {
      body.velocity.set(vector.velocity.x, vector.velocity.y, vector.velocity.z);
    }

    body.linearDamping = 0.1;
    body.angularDamping = 0.1;
  }

  public setMeshPosition(mesh, position, index = 0) {

    if (mesh.isInstancedMesh) {

      const bodies = this.meshMap.get(mesh);
      bodies[index].position.copy(position);

    } else if (mesh.isMesh) {

      const body = this.meshMap.get(mesh);
      body.position.copy(position);

    }

  }

  public step() {

    const time = performance.now();

    if (this.lastTime > 0) {

      const delta = (time - this.lastTime) / 1000;

      // console.time( 'world.step' );
      this.world.step(this.frameTime, delta, this.frameRate);
      // console.timeEnd( 'world.step' );

    }

    this.lastTime = time;

    for (let i = 0, l = this.meshes.length; i < l; i++) {

      const mesh = this.meshes[i];

      if (mesh.isInstancedMesh) {

        const array = mesh.instanceMatrix.array;
        const bodies = this.meshMap.get(mesh);

        for (let j = 0; j < bodies.length; j++) {

          const bodyA = bodies[j];
          compose(bodyA.position, bodyA.quaternion, array, j * 16);

        }

        mesh.instanceMatrix.needsUpdate = true;

      } else if (mesh.isMesh) {

        const body = this.meshMap.get(mesh);
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);

      }

    }

  }

}

