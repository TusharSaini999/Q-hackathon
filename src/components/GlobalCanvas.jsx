import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Center, Float } from "@react-three/drei";
import { SVGLoader } from "three-stdlib";
import { useScroll, useTransform, useSpring } from "framer-motion";

const CinematicBokeh = ({ scrollOpacity }) => {
  const bokehTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.4)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const orbs = useMemo(() => Array.from({ length: 18 }, () => ({
    x: (Math.random() - 0.5) * 25,
    y: (Math.random() - 0.5) * 25,
    z: (Math.random() - 0.5) * 15 - 5, 
    size: Math.random() * 3 + 1.5,     
    color: Math.random() > 0.6 ? "#e51a80" : (Math.random() > 0.5 ? "#8c2e7c" : "#4a1542"),
    speed: Math.random() * 0.5 + 0.1,
    baseOpacity: Math.random() * 0.4 + 0.1
  })), []);

  const spritesRef = useRef([]);

  useFrame(() => {
    const op = scrollOpacity.get();
    spritesRef.current.forEach((sprite, i) => {
      if (sprite) {
        sprite.material.opacity = orbs[i].baseOpacity * op;
      }
    });
  });
  return (
    <group>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.1} floatIntensity={1.5} position={[orb.x, orb.y, orb.z]}>
          <sprite ref={el => spritesRef.current[i] = el} scale={[orb.size, orb.size, 1]}>
            <spriteMaterial 
              map={bokehTexture} 
              color={orb.color} 
              transparent 
              depthWrite={false}
              blending={THREE.AdditiveBlending} 
            />
          </sprite>
        </Float>
      ))}
    </group>
  );
};

const TravelingLogo = ({ smoothProgress }) => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5; 

  const logoPath = import.meta.env.BASE_URL + 'qu-logo.svg';
  const svg = useLoader(SVGLoader, logoPath);
  const shapes = useMemo(() => svg.paths.flatMap(p => p.toShapes(true)), [svg]);
  const maxOffset = viewport.width * 0.35; 
  const rightX = maxOffset;
  const leftX = -maxOffset;
  const xPosition = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [-1.4, rightX, leftX, rightX, leftX]);
  const yRotation = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, Math.PI * 2, Math.PI * 4, Math.PI * 6, Math.PI * 8]);

  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      if (isMobile) {
        groupRef.current.position.x = 0;
        groupRef.current.rotation.y = 0;
      } else {
        groupRef.current.position.x = xPosition.get();
        groupRef.current.rotation.y = yRotation.get();
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={1.5}>
        <Center scale={isMobile ? 0.008 : 0.015}>
          <group rotation={[Math.PI, 0, 0]}>
            {shapes.map((shape, index) => (
              <mesh 
                key={index} 
                position={[0, 0, index * 0.01]} 
              >
                <extrudeGeometry args={[shape, { depth: 30, bevelEnabled: true, bevelSize: 1 }]} />
                <meshPhysicalMaterial
                  color="#e51a80"
                  emissive="#8c2e7c"
                  emissiveIntensity={0.3}
                  metalness={0.6}
                  roughness={0.2}
                  transparent={true}
                  opacity={0.35} 
                />
              </mesh>
            ))}
          </group>
        </Center>
      </Float>
    </group>
  );
};

const GlobalCanvas = () => {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 15,
    restDelta: 0.001
  });

  const bokehOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0.3]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        
        <TravelingLogo smoothProgress={smoothProgress} />
        <CinematicBokeh scrollOpacity={bokehOpacity} />
      </Canvas>
    </div>
  );
};

export default GlobalCanvas;