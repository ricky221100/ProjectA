import {Color, Face3, Geometry, Sphere, Vector2, Vector3} from 'three';

export const toVectors = (vertices: any[]) => vertices.map((vertice) => new Vector3().fromArray(vertice).normalize());

export function create_geom(vectors, faces, radius, tab, af, chamfer) {
  const cg = chamfer_geom(vectors, faces, chamfer);
  const geom = make_geom(cg.vectors, cg.faces, radius, tab, af);
  // const geom = make_geom(vectors, faces, radius, tab, af); // Without chamfer
  return geom;
}

export function chamfer_geom(vectors, faces, chamfer) {
  let vv;
  let face;
  let i;

  const chamfer_vectors = [];
  const chamfer_faces = [];
  const corner_faces = new Array(vectors.length);

  for (i = 0; i < vectors.length; ++i) {
    corner_faces[i] = [];
  }
  for (i = 0; i < faces.length; ++i) {
    let j;
    const ii = faces[i];
    const fl = ii.length - 1;
    const center_point = new Vector3();
    face = new Array(fl);
    for (j = 0; j < fl; ++j) {
      vv = vectors[ii[j]].clone();
      center_point.add(vv);
      corner_faces[ii[j]].push(face[j] = chamfer_vectors.push(vv) - 1);
    }
    center_point.divideScalar(fl);
    for (j = 0; j < fl; ++j) {
      vv = chamfer_vectors[face[j]];
      vv.subVectors(vv, center_point).multiplyScalar(chamfer).addVectors(vv, center_point);
    }
    face.push(ii[fl]);
    chamfer_faces.push(face);
  }
  for (i = 0; i < faces.length - 1; ++i) {
    for (let j = i + 1; j < faces.length; ++j) {
      const pairs = [];
      let lastm = -1;
      for (let m = 0; m < faces[i].length - 1; ++m) {
        const n = faces[j].indexOf(faces[i][m]);
        if (n >= 0 && n < faces[j].length - 1) {
          // tslint:disable-next-line:triple-equals
          if (lastm >= 0 && m != lastm + 1) {
            pairs.unshift([i, m], [j, n]);
          } else {
            pairs.push([i, m], [j, n]);
          }
          lastm = m;
        }
      }
      // tslint:disable-next-line:triple-equals
      if (pairs.length != 4) {
        continue;
      }
      chamfer_faces.push([chamfer_faces[pairs[0][0]][pairs[0][1]],
        chamfer_faces[pairs[1][0]][pairs[1][1]],
        chamfer_faces[pairs[3][0]][pairs[3][1]],
        chamfer_faces[pairs[2][0]][pairs[2][1]], -1]);
    }
  }
  for (i = 0; i < corner_faces.length; ++i) {
    const cf = corner_faces[i];
    face = [cf[0]];
    let count = cf.length - 1;
    while (count) {
      for (let m: number = faces.length; m < chamfer_faces.length; ++m) {
        let index = chamfer_faces[m].indexOf(face[face.length - 1]);
        if (index >= 0 && index < 4) {
          // tslint:disable-next-line:triple-equals
          if (--index == -1) {
            index = 3;
          }
          const next_vertex = chamfer_faces[m][index];
          if (cf.indexOf(next_vertex) >= 0) {
            face.push(next_vertex);
            break;
          }
        }
      }
      --count;
    }
    face.push(-1);
    chamfer_faces.push(face);
  }
  return {vectors: chamfer_vectors, faces: chamfer_faces};
}

function make_geom(vertices, faces, radius, tab, af) {
  let i;
  const geom = new Geometry();
  for (i = 0; i < vertices.length; ++i) {
    const vertex = vertices[i].multiplyScalar(radius);
    vertex.index = geom.vertices.push(vertex) - 1;
  }
  for (i = 0; i < faces.length; ++i) {
    const ii = faces[i];
    const fl = ii.length - 1;
    const aa = Math.PI * 2 / fl;
    for (let j = 0; j < fl - 2; ++j) {
      geom.faces.push(new Face3(ii[0], ii[j + 1], ii[j + 2], [geom.vertices[ii[0]],
        geom.vertices[ii[j + 1]], geom.vertices[ii[j + 2]]], new Color(0), ii[fl] + 1));
      geom.faceVertexUvs[0].push([
        new Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab),
          (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
        new Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
          (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
        new Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
          (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))]);
    }
  }
  geom.computeFaceNormals();
  geom.boundingSphere = new Sphere(new Vector3(), radius);
  return geom;
}

export function calc_texture_size(approx) {
  return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
}

export const visibleHeightAtDepth = (depth, camera) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) {
    depth -= cameraOffset;
  } else {
    depth += cameraOffset;
  }

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

export const visibleWidthAtDepth = (depth, camera) => {
  const height = visibleHeightAtDepth(depth, camera);
  return height * camera.aspect;
};

export const visibleAtDepth = (depth, camera) => {
  const width = visibleWidthAtDepth(depth, camera);
  const height = visibleHeightAtDepth(depth, camera);
  return {width, height};
};
