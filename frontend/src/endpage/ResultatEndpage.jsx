import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sky, Text, Stars } from '@react-three/drei';
import CameraControls from '../3d/CameraControls';
import LoadAvatar from './LoadAvatar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ResultPage() {
  const { id } = useParams(); // Get end_page_id from URL
  const [endPage, setEndPage] = useState({
    type: 'démission',
    ton: 'DRAMATIQUE',
    expression: 'triste',
    fin_voulue: '',
    avatar_sexe: 'MASCULIN',
    avatar_mode: 'RELAX',
    avatar_pseudo: '',
    version_des_faits: '',
  });
  const [introDone, setIntroDone] = useState(false);
  const [error, setError] = useState(null);

  // Phase 1: 5s intro
  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch end page details after intro
  useEffect(() => {
    if (!introDone) return;
    async function fetchDetails() {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          `http://192.168.85.213:8000/api/endpage/${id}/details/?detail=true`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            timeout: 5000,
          }
        );
        setEndPage({
          type: data.type,
          ton: data.ton,
          expression: data.expression,
          fin_voulue: data.fin_voulue || '',
          avatar_sexe: data.avatar_sexe || 'MASCULIN',
          avatar_mode: data.avatar_mode || 'RELAX',
          avatar_pseudo: data.avatar_pseudo || '',
          version_des_faits: data.version_des_faits || '',
        });
      } catch (err) {
        console.error('Erreur lors du fetch:', err);
        setError('Impossible de charger les détails de la page de fin.');
      }
    }
    fetchDetails();
  }, [introDone, id]);

  // Mapping ton → expression for avatar animation
  const expressionMap = {
    DRAMATIQUE: 'angry',
    IRONIQUE: 'idle',
    HUMORISTIQUE: 'thankful',
    SERIEUX: 'idle',
    OPTIMISTE: 'thankful',
    NOSTALGIQUE: 'sad',
    POETIQUE: 'thankful',
    SARCASTIQUE: 'idle',
    REFLEXIF: 'idle',
    EMOTIF: 'sad',
    triste: 'sad',
    colère: 'angry',
    joie: 'thankful',
    surpris: 'surprised',
  };
  const avatarExpression = expressionMap[endPage.expression] || expressionMap[endPage.ton] || 'idle';

  // Couleurs d’arrière-plan par émotion (thème sombre)
  const bgColorMap = {
    angry: '#330000',
    sad: '#001133',
    thankful: '#003300',
    surprised: '#332200',
    idle: '#111111',
  };
  const backgroundColor = bgColorMap[avatarExpression];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
      {error && <div className="error-message">{error}</div>}
      <Canvas
        style={{ backgroundColor, width: '100%', height: '100%' }}
        shadows
        camera={{ position: [0, 1.1, 5], fov: 30 }}
      >
        <CameraControls />
        <ambientLight intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={1} castShadow />
        <Sky
          distance={450000}
          sunPosition={[0, 0, 0]}
          inclination={0}
          azimuth={0.25}
          turbidity={0.1}
          rayleigh={0.1}
        />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        <Environment preset="night" background />

        {!introDone && <IntroText3D />}

        {introDone && (
          <>
            <Suspense fallback={<LoadingFallback />}>
              <LoadAvatar
                gender={endPage.avatar_sexe.toLowerCase() === 'feminin' ? 'female' : 'male'}
                mode={endPage.avatar_mode}
                expression={avatarExpression}
                animation={avatarExpression}
              />
            </Suspense>
            <RepeatTextBehindAvatar message={endPage.version_des_faits.slice(0, 50) || "Mon histoire"} />
          </>
        )}
      </Canvas>
    </div>
  );
}

function IntroText3D() {
  const textRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (textRef.current) {
      const scale = 0.5 + Math.sin(t * 2) * 0.05;
      textRef.current.scale.set(scale, scale, scale);
      const hue = (t * 20) % 360 / 360;
      textRef.current.material.color.setHSL(hue, 0.8, 0.6);
    }
  });
  return (
    <Text
      ref={textRef}
      position={[0, -1.5, -5]}
      fontSize={0.7}
      color="#fff"
      anchorX="center"
      anchorY="middle"
    >
      J'ai le malheur de vous annoncer que...
    </Text>
  );
}

function RepeatTextBehindAvatar({ message }) {
  const textRef = useRef();
  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.position.set(2.5, -1.5, -5);
      textRef.current.lookAt(camera.position);
    }
  });
  return (
    <Text
      ref={textRef}
      fontSize={0.5}
      color="#fff"
      anchorX="center"
      anchorY="middle"
      depthTest
    >
      {message}
    </Text>
  );
}

function LoadingFallback() {
  const groupRef = useRef();
  const textRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    if (textRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      textRef.current.scale.set(scale, scale, scale);
      const hue = (t * 30) % 360 / 360;
      textRef.current.material.color.setHSL(hue, 0.6, 0.7);
    }
  });
  return (
    <group ref={groupRef}>
      <Text
        ref={textRef}
        fontSize={0.4}
        anchorX="center"
        anchorY="middle"
        color="#fff"
      >
        CHARGEMENT...
      </Text>
    </group>
  );
}