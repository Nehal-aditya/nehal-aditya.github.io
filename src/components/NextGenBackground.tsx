import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Neural Network Node - Individual floating node with glow effect
 */
interface NeuralNodeProps {
  position: THREE.Vector3;
  id: number;
  mousePos: React.MutableRefObject<THREE.Vector2>;
}

function NeuralNode({ position, id, mousePos }: NeuralNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useMemo(() => position.clone(), [position]);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Subtle floating animation
      meshRef.current.position.x = initialPos.x + Math.sin(time * 0.5 + id) * 0.2;
      meshRef.current.position.y = initialPos.y + Math.cos(time * 0.3 + id) * 0.2;
      meshRef.current.position.z = initialPos.z + Math.sin(time * 0.4 + id) * 0.2;

      // Interaction with mouse
      const mouseX = (mousePos.current.x * state.viewport.width) / 2;
      const mouseY = (mousePos.current.y * state.viewport.height) / 2;
      
      const dist = meshRef.current.position.distanceTo(new THREE.Vector3(mouseX, mouseY, 0));
      if (dist < 3) {
        const force = (3 - dist) / 3;
        meshRef.current.position.lerp(new THREE.Vector3(mouseX, mouseY, 0), force * 0.05);
        if (!hovered) setHovered(true);
      } else {
        if (hovered) setHovered(false);
      }

      // Scale pulse effect
      const scale = hovered ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
    >
      <octahedronGeometry args={[0.15, 0]} />
      <meshPhongMaterial
        color={hovered ? '#ff006e' : '#00d9ff'}
        emissive={hovered ? '#ff0066' : '#0099cc'}
        emissiveIntensity={hovered ? 2 : 0.8}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

/**
 * Neural Network Connections - Optimized line rendering
 */
function NeuralConnections({ nodes, mousePos }: { nodes: THREE.Vector3[], mousePos: React.MutableRefObject<THREE.Vector2> }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const connections = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 5) {
          points.push(nodes[i], nodes[j]);
        }
      }
    }
    return points;
  }, [nodes]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(connections);
  }, [connections]);

  useFrame((state) => {
    if (linesRef.current) {
      const time = state.clock.getElapsedTime();
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = 0.2 + Math.sin(time) * 0.1;
      
      // Subtle rotation
      linesRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
      linesRef.current.rotation.x = Math.cos(time * 0.1) * 0.1;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#00d9ff" transparent opacity={0.2} linewidth={1} />
    </lineSegments>
  );
}

/**
 * Neural Network - Main interactive network
 */
function NeuralNetwork() {
  const mousePos = useRef(new THREE.Vector2(0, 0));
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const nodeCount = 60;
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 15
    ));
  }, []);

  return (
    <group>
      <NeuralConnections nodes={nodes} mousePos={mousePos} />
      {nodes.map((pos, i) => (
        <NeuralNode key={i} id={i} position={pos} mousePos={mousePos} />
      ))}
    </group>
  );
}

/**
 * Camera Controller - Manages scroll-based camera movement
 */
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 15);
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });

    tl.to(camera.position, {
      z: 8,
      y: -5,
      x: 2,
      ease: "none"
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [camera]);

  return null;
}

/**
 * Scene Component
 */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d9ff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff006e" />
      
      <NeuralNetwork />
      <CameraController />
      <Preload all />
    </>
  );
}

/**
 * NextGenBackground - Main component wrapper
 */
export default function NextGenBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
        background: '#05050a',
        pointerEvents: 'none', // Allow clicking through to content
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(10, 10, 30, 0.5) 0%, rgba(0, 0, 0, 1) 100%)',
        zIndex: 0
      }} />
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'auto', // Re-enable for the canvas itself
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
