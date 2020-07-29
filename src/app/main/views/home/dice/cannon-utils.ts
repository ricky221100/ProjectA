import {ConvexPolyhedron, Vec3} from 'cannon-es';
import {Vector3} from 'three';

export function create_shape(vertices: Vector3[], faces: number[][], radius: number) {
  let i;
  const cv = new Array(vertices.length);
  const cf = new Array(faces.length);
  for (i = 0; i < vertices.length; ++i) {
    const v = vertices[i];
    cv[i] = new Vec3(v.x * radius, v.y * radius, v.z * radius);
  }
  for (i = 0; i < faces.length; ++i) {
    cf[i] = faces[i].slice(0, faces[i].length - 1);
  }
  return new ConvexPolyhedron({vertices: cv, faces: cf});
}
