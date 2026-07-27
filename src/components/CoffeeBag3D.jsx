import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const BAG_W = 1.6;
const BAG_H = 2.2;
const BAG_D = 0.7;

function BagBox() {
  return (
    <mesh position={[0, 0, 0]} castShadow>
      <boxGeometry args={[BAG_W, BAG_H, BAG_D]} />
      <meshStandardMaterial color="#c8922b" roughness={0.5} metalness={0.1} />
    </mesh>
  );
}

export default function CoffeeBag3D({ className }) {
  return (
    <div className={className} style={{ width: "100%", height: "440px" }}>
      <Canvas
        shadows
        camera={{ position: [3.2, 1.8, 3.2], fov: 32 }}
        gl={{ antialias: true }}
        onCreated={(state) => console.log("[CoffeeBag3D] Canvas ready", state.gl.capabilities)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />
        <BagBox />
        <mesh position={[0, -BAG_H / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <shadowMaterial opacity={0.25} />
        </mesh>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
