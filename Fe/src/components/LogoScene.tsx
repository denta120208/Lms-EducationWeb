import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

type LogoTarget = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  visible?: boolean;
};

type LogoMeshProps = {
  textureUrl?: string;
  target: LogoTarget;
  initial?: boolean;
};

function LogoMesh({ textureUrl = '/SMK LOGO.png', target, initial }: LogoMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useTexture(textureUrl);
  const [aspect, setAspect] = useState(1);

  useEffect(() => {
    if (!groupRef.current || !meshRef.current) return;
    if (initial) {
      gsap.set(groupRef.current.scale, { x: 0.2, y: 0.2, z: 0.2 });
      gsap.set(meshRef.current.material as any, { opacity: 0 });
      gsap.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power3.out' });
      gsap.to(meshRef.current.material as any, { opacity: 1, duration: 1.0, ease: 'power3.out' });
    }
  }, [initial]);

  useEffect(() => {
    if (!groupRef.current) return;
    const m = groupRef.current;
    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.inOut' } });
    tl.to(m.position, { x: target.position[0], y: target.position[1], z: target.position[2] }, 0)
      .to(m.rotation, { x: target.rotation[0], y: target.rotation[1], z: target.rotation[2] }, 0)
      .to(m.scale, { x: target.scale, y: target.scale, z: target.scale }, 0);
    if (typeof target.visible === 'boolean') {
      if (meshRef.current) tl.to(meshRef.current.material as any, { opacity: target.visible ? 1 : 0 }, 0);
    }
    return () => {
      tl.kill();
    };
  }, [target]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle wobble only, stays facing forward (no full spin)
    const wobbleY = 0.12 * Math.sin(t * 0.7);
    const wobbleX = 0.06 * Math.sin(t * 0.9);
    meshRef.current.rotation.y = wobbleY;
    meshRef.current.rotation.x = wobbleX;
  });
  
  // Update aspect ratio when texture loads
  useEffect(() => {
    const img = texture?.image as HTMLImageElement | undefined;
    if (img && img.width && img.height) {
      setAspect(img.height / img.width);
    }
  }, [texture]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2 * aspect, 1, 1), [aspect]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          opacity={1}
          alphaTest={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

type LogoSceneProps = {
  target: LogoTarget;
};

export default function LogoScene({ target }: LogoSceneProps) {
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      camera={{ fov: 60, position: [0, 0, 8] }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <LogoMesh target={target} initial />
    </Canvas>
  );
}

