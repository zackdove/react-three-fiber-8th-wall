//import * as THREE from 'three';
import React, { useEffect, useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import SceneParts from "../sceneParts";

const XR3F = ({ name, updateCtx }) => {
  const { scene, gl, camera } = useThree();

  const [tapTarget, setTapTarget] = useState(null);
  const $surface = useRef();
  const $box = useRef();

  const canvas = gl.domElement;
  canvas.id = name;

  useFrame(({ gl, scene, camera }) => {
    gl.clearDepth();
    gl.render(scene, camera);
  }, 1);

  const { XR8, THREE } = window;

  useEffect(() => {
    XR8.addCameraPipelineModule({
      name: "xrthree",
      onStart,
      onUpdate,
      //onRender,
      onCanvasSizeChange,
      xrScene: xrScene,
    });

    //window.addEventListener('touchstart', handleTouchEvent);
  });

  const onCanvasSizeChange = ({ canvasWidth, canvasHeight }) => {
    gl.setSize(canvasWidth, canvasHeight);
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
  };

  const onStart = ({ canvasWidth, canvasHeight }) => {
    gl.autoClear = false;
    gl.setSize(canvasWidth, canvasHeight);
    gl.antialias = true;

    // eslint-disable-next-line no-debugger
    debugger;
    // Update React ctx
    updateCtx({
      scene,
      camera,
      renderer: gl,
    });

    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    });
  };

  const onUpdate = ({ processCpuResult }) => {
    camera.updateProjectionMatrix();

    let data = processCpuResult.reality;
    if (!(data && data.intrinsics)) return;

    let { intrinsics, position, rotation } = data;
    let { elements } = camera.projectionMatrix;

    for (let i = 0; i < 16; i++) {
      elements[i] = intrinsics[i];
    }

    //  _getCameraPosition() {
    //   if (!this.viewProjectionMatrix) {
    //    return new THREE.Vector3();
    //   }

    //   const cam = new THREE.Camera();
    //   const rootInverse = new THREE.Matrix4().getInverse(this.rootTransform);
    //   cam.projectionMatrix.elements = this.viewProjectionMatrix;
    //   cam.projectionMatrixInverse = new THREE.Matrix4().getInverse(cam.projectionMatrix); // add since three@0.103.0
    //   const campos = new THREE.Vector3(0, 0, 0).unproject(cam).applyMatrix4(rootInverse);
    //   return campos;
    //  }

    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    //camera.projectionMatrixInverse.getInverse(camera.projectionMatrix);
    camera.setRotationFromQuaternion(rotation);
    camera.position.copy(position);
  };

  const xrScene = () => {
    return { scene, camera, renderer: gl };
  };

  return (
    <group>
      <mesh
        onPointerDown={(e) => setTapTarget(e.intersections[0].point)}
        receiveShadow
        position={[0, 0, 0]}
        ref={$surface}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry attach="geometry" args={[100, 100, 1, 1]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
      <group position={[0, 0.5, 0]}>
        <mesh
          castShadow
          position={tapTarget}
          visible={!!tapTarget}
          ref={$box}
          userData={{ hello: "yop" }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="purple" />
        </mesh>
      </group>
      <group position={[0, 0, 0]}>
        <mesh castShadow position={tapTarget} visible={!!tapTarget} ref={$box}>
          <SceneParts />
        </mesh>
      </group>
    </group>
  );
};

export default XR3F;
