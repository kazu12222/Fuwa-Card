"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

const ARScene = () => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // シーンの初期化
    const scene = new THREE.Scene();

    // カメラの設定
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 3); // カメラの初期位置

    // レンダラーの設定
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // ARButtonを追加してARモードを開始するボタンを作成
    const arButton = ARButton.createButton(renderer);
    document.body.appendChild(arButton);

    // 環境光を追加
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // GLTFモデルの読み込み
    const loader = new GLTFLoader();
    loader.load("/model.gltf", (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.005, 0.005, 0.005); // モデルのスケール
      model.position.set(0, 0, 0.1); // モデルの位置
      scene.add(model);
      setIsLoading(false); // モデルが読み込まれた後にローディングを終了
    });

    // アニメーションの設定
    const animate = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    animate();

    // ウィンドウリサイズ時にカメラとレンダラーのサイズを更新
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(arButton); // ARボタンを削除
      renderer.dispose(); // レンダラーのリソースを解放
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="text-xl">ARを準備中...</p>
      </div>
    );
  }

  return <div ref={containerRef}></div>;
};

export default ARScene;
