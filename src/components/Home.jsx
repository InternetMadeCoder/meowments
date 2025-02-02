import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'

function Model() {
  const gltf = useGLTF('/scene.gltf')
  return (
    <primitive 
      object={gltf.scene} 
      scale={550} 
      position={[0, -5, 0]}  // Adjusted position to move model inside the container
      rotation={[0, Math.PI / 3, 0]} 
    />
  )
}

const Home = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center px-12"> {/* Added overall padding */}
      {/* Left side - Text Content */}
      <div className="w-2/5 pl-8 space-y-8"> {/* Changed from w-1/3 to w-2/5 and reduced left padding */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-800 whitespace-nowrap"> {/* Added whitespace-nowrap */}
            happy birthday
          </h1>
          <div className="h-16">
            <TypeAnimation
              sequence={[
                'phaukzee!!!',
                1000,
                'foxyyyy!!!',
                1000,
                'cutieee!!!',
                1000,
                'pookieee!!!',
                1000,
                'patootiee!!!',
                1000,
              ]}
              wrapper="h2"
              speed={50}
              className="text-5xl font-bold text-rose-500 block" // Added block
              repeat={Infinity}
            />
          </div>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed text-justify max-w-xl"> {/* Added text-justify and max-w-xl */}
          you know how we can never get enough of cute animal pics? 
          well, I thought, why not create a place where we can share and keep them forever? a little corner for all the adorable <b>MeowMents</b> we love! 🐾 💕
        </p>
        <button className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-colors">
          Get Started
        </button>
      </div>

      {/* Right side - 3D Model */}
      <div className="w-3/5 h-[90vh] flex items-center justify-end pr-4"> {/* Changed justify-center to justify-end and adjusted padding */}
        <div 
          className="w-[600px] h-[600px] rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-pink-100 cursor-pointer translate-x-8" /* Added translate-x-8 to move right */
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Canvas 
            camera={{ 
              position: [0, 2, 18], 
              fov: 50, 
              near: 0.1,
              far: 1000
            }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={2} 
              castShadow
            />
            <Suspense fallback={null}>
              <Model />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2.2}
                maxPolarAngle={Math.PI / 2.2}
                autoRotate={!isHovered}
                autoRotateSpeed={3}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  )
}

export default Home

useGLTF.preload('/scene.gltf')
