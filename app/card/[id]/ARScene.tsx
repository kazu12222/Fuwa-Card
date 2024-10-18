import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ARScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1.6, 3);
    cameraRef.current = camera;

    // レンダラーの初期化
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // カメラ映像を背景に設定
    const setVideoBackground = (stream: MediaStream) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;

      video.onloadedmetadata = () => {
        video.play();
        const videoTexture = new THREE.VideoTexture(video);
        scene.background = videoTexture;
      };
    };

    // 外カメラを試みる
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { exact: "environment" } },
      })
      .then(setVideoBackground)
      .catch(() => {
        // 外カメラが失敗した場合、内カメラを使用
        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode: "user" },
          })
          .then(setVideoBackground)
          .catch((error) => {
            console.error("カメラのアクセスに失敗しました:", error);
          });
      });

    // レンダリングループ
    const renderScene = () => {
      requestAnimationFrame(renderScene);
      renderer.render(scene, camera);
    };
    renderScene();

    // ウィンドウリサイズ対応
    const onWindowResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ARScene;
