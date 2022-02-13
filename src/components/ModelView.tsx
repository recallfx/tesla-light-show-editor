import React, { Suspense, useState, useRef } from 'react';
import { Canvas, Vector3 } from '@react-three/fiber';
import { PresentationControls, useGLTF, MeshReflectorMaterial, Environment, Stage } from '@react-three/drei';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilValue } from 'recoil';

import { channelsConfig } from '../Config';
import { channelValueStateFamily } from '../foundation/state';

function Model(props: any) {
  const { scene } = useGLTF('/models/Model_S/ModelS.gltf');
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <primitive object={scene} {...props} />;
}

function ChannelSpheres({ points, id, label }: { points: Array<Vector3>; id: number; label: String }) {
  const matRef = useRef();
  const channelValue = useRecoilValue(channelValueStateFamily(id - 1));
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  let color: string;

  switch (id) {
    case 25:
      color = 'green';
      break;
    case 26:
      color = 'yellow';
      break;
    case 27:
      color = 'blue';
      break;
    case 28:
      color = 'teal';
      break;
    case 29:
      color = 'aquamarine';
      break;
    case 30:
      color = 'cadetblue';
      break;
    default:
      color = 'orange';
      break;
  }

  if (hovered) {
    color = 'silver';
  }

  if (clicked) {
    color = 'white';
  }

  if (channelValue > 0) {
    color = 'red';
  }

  const onClick = () => {
    console.log('clicked', id, label);
    click(!clicked);
  };

  const spheres = points.map((position, index) => (
    <mesh
      // eslint-disable-next-line react/no-array-index-key
      key={`${id}-${index}`}
      position={position}
      scale={clicked ? 1.5 : 1}
      onClick={onClick}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <sphereGeometry args={[5]} />
      <meshStandardMaterial ref={matRef} color={hovered ? 'hotpink' : color} />
    </mesh>
  ));

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{spheres}</>;
}

export default function ModelView() {
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  return (
    <Suspense fallback={null}>
      <Canvas shadows camera={{ position: [400, 300, 300], fov: 25, far: 2000 }}>
        <color attach='background' args={['#191920']} />
        <fog attach='fog' args={['#191920', 0, 5000]} />
        <Environment preset='city' />

        <PresentationControls speed={1.5} global zoom={1.5} polar={[0, 0]}>
          <Stage environment='warehouse' intensity={0.5} contactShadow={false} shadowBias={-0.0015}>
            <RecoilBridge>
              <Model />
              {channelsConfig.map(({ id, points, title }) => (
                <ChannelSpheres id={id} points={points as Array<Vector3>} label={title} key={`${id}`} />
              ))}
            </RecoilBridge>
          </Stage>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[10000, 10000]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={60}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color='#151515'
              metalness={0.5}
              mirror={1}
            />
          </mesh>
        </PresentationControls>
      </Canvas>
    </Suspense>
  );
}
