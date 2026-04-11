import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Preload } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Galaxy Component - Central 3D celestial object with animated rings
 */
function Galaxy() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0001;
      meshRef.current.rotation.z += 0.0003;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Central sphere */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          color="#00d9ff"
          emissive="#0099cc"
          emissiveIntensity={0.5}
          wireframe={false}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh scale={1.3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.15}
          wireframe={false}
        />
      </mesh>

      {/* Animated rings */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2, 0.3, 16, 100]} />
        <meshPhongMaterial
          color="#ff006e"
          emissive="#ff0066"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.2, 16, 100]} />
        <meshPhongMaterial
          color="#00d9ff"
          emissive="#0099cc"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

/**
 * Neural Network Node - Individual floating node with glow effect
 */
interface NeuralNodeProps {
  position: [number, number, number];
  id: number;
}

function NeuralNode({ position, id }: NeuralNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y += Math.sin(Date.now() * 0.0005 + id) * 0.0005;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;

      // Scale pulse effect
      const scale = hovered ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <octahedronGeometry args={[0.3, 0]} />
      <meshPhongMaterial
        color={hovered ? '#ff006e' : '#00d9ff'}
        emissive={hovered ? '#ff0066' : '#0099cc'}
        emissiveIntensity={hovered ? 0.8 : 0.4}
        wireframe={false}
      />
    </mesh>
  );
}

/**
 * Neural Network Line - Pulsing connections between nodes
 */
interface NeuralLineProps {
  start: [number, number, number];
  end: [number, number, number];
  id: number;
}

function NeuralLine({ start, end, id }: NeuralLineProps) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    if (lineRef.current) {
      // Pulsing opacity effect
      const opacity = 0.3 + Math.sin(Date.now() * 0.003 + id) * 0.3;
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
    }
  });

  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#00d9ff"
        transparent
        opacity={0.5}
        linewidth={2}
      />
    </line>
  );
}

/**
 * Neural Network - Interactive network of nodes and connections
 */
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const [nodes, setNodes] = useState<Array<{ id: number; pos: [number, number, number] }>>([]);
  const [connections, setConnections] = useState<Array<{ id: number; start: [number, number, number]; end: [number, number, number] }>>([]);

  useEffect(() => {
    // Generate random neural network nodes
    const nodeCount = 15;
    const generatedNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      pos: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
    }));

    setNodes(generatedNodes);

    // Generate connections between nearby nodes
    const generatedConnections = [];
    let connectionId = 0;

    for (let i = 0; i < generatedNodes.length; i++) {
      for (let j = i + 1; j < generatedNodes.length; j++) {
        const dist = Math.hypot(
          generatedNodes[i].pos[0] - generatedNodes[j].pos[0],
          generatedNodes[i].pos[1] - generatedNodes[j].pos[1],
          generatedNodes[i].pos[2] - generatedNodes[j].pos[2]
        );

        // Connect nodes that are within a certain distance
        if (dist < 12) {
          generatedConnections.push({
            id: connectionId++,
            start: generatedNodes[i].pos,
            end: generatedNodes[j].pos,
          });
        }
      }
    }

    setConnections(generatedConnections);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0001;
      groupRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render neural network lines */}
      {connections.map((conn) => (
        <NeuralLine key={conn.id} start={conn.start} end={conn.end} id={conn.id} />
      ))}

      {/* Render neural network nodes */}
      {nodes.map((node) => (
        <NeuralNode key={node.id} position={node.pos} id={node.id} />
      ))}
    </group>
  );
}

/**
 * Camera Controller - Manages scroll-based camera movement with GSAP
 */
function CameraController() {
  const { camera } = useThree();
  const cameraRef = useRef({
    x: 0,
    y: 0,
    z: 15,
  });

  useEffect(() => {
    // Initial camera position
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    // Create scroll trigger animation
    gsap.to(cameraRef.current, {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
          // Move camera through the neural network as user scrolls
          const progress = self.progress;

          cameraRef.current.x = Math.sin(progress * Math.PI * 2) * 15;
          cameraRef.current.y = (progress * 30) - 15;
          cameraRef.current.z = 15 - progress * 10;

          camera.position.set(
            cameraRef.current.x,
            cameraRef.current.y,
            cameraRef.current.z
          );
          camera.lookAt(0, 0, 0);
        },
      },
      duration: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [camera]);

  return null;
}

/**
 * Scene Component - Main 3D scene container
 */
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff006e" />

      {/* Background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.1} />

      {/* Central galaxy */}
      <Galaxy />

      {/* Neural network */}
      <NeuralNetwork />

      {/* Camera controller */}
      <CameraController />

      {/* Orbit controls for fallback interaction */}
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />

      {/* Preload assets */}
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
        background: 'radial-gradient(ellipse at center, #0a0a15 0%, #000000 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{
          width: '100%',
          height: '100%',
        }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
