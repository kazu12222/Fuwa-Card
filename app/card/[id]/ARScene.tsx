"use client";
import { useEffect, useState } from "react";

const ARScene = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isScriptExist = (src: string): boolean => {
      return document.querySelector(`script[src="${src}"]`) !== null;
    };

    const loadScript = async (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (isScriptExist(src)) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript("https://aframe.io/releases/1.5.0/aframe.min.js");
        await loadScript(
          "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load scripts:", error);
      }
    };

    loadScripts();

    return () => {
      const scene = document.querySelector("a-scene");
      if (scene && scene.systems["mindar-image-system"]) {
        scene.systems["mindar-image-system"].stop();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="text-xl">ARを準備中...</p>
      </div>
    );
  }

  return (
    <div>
      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; filterMinCF:0.0001; filterBeta: 0.001"
        color-space="sRGB"
        renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-assets>
          <a-asset-item id="avatarModel" src="/model.gltf"></a-asset-item>
          <audio id="bgMusic" src="/music.mp3" preload="auto"></audio>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
        {/* <a-camera position="0 1.6 3" look-controls="enabled: false"></a-camera> */}

        <a-entity mindar-image-target="targetIndex: 0">
          <a-gltf-model
            rotation="0 0 0"
            position="0 0 0.1"
            scale="0.005 0.005 0.005"
            src="#avatarModel"
            animation__position="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
            animation__rotate="property: rotation; to: 0 360 0; dur: 5000; easing: linear; loop: true"
          ></a-gltf-model>
        </a-entity>
      </a-scene>
    </div>
  );
};

export default ARScene;
