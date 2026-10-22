import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [slow, setSlow] = useState(false);
  const [failed, setFailed] = useState(false);
  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;
      let disposed = false;
      let frame = 0;
      const onResize = () => {
        if (characterObject) handleResize(renderer, camera, canvasDiv, characterObject);
      };
      let characterObject: THREE.Object3D | null = null;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
      } catch (error) {
        console.error("3D renderer unavailable", error);
        setFailed(true);
        setAllTimeline();
        setLoading(100);
        return;
      }
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      let loadingFailed = false;
      const failLoading = (error: unknown) => {
        if (disposed || loadingFailed) return;
        loadingFailed = true;
        console.error("3D preview unavailable", error);
        progress.clear();
        cancelAnimationFrame(frame);
        setFailed(true);
        setAllTimeline();
      };
      // A slow download or shader compilation is not a failed model. Release
      // the blocking intro, but accept the result whenever loading completes.
      const loadTimeout = setTimeout(() => {
        if (disposed || loadingFailed) return;
        progress.clear();
        setSlow(true);
        setAllTimeline();
      }, 30000);
      loadCharacter().then((gltf) => {
        clearTimeout(loadTimeout);
        if (gltf && !disposed && !loadingFailed) {
          setSlow(false);
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          characterObject = character;
          setChar(character);
          scene.add(character);
          setCharTimeline(character, camera);
          setAllTimeline();
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            if (disposed) return;
            setTimeout(() => {
              if (disposed) return;
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          window.addEventListener("resize", onResize);
        }
      }).catch(error => { clearTimeout(loadTimeout); failLoading(error); });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      const onTouchMove = (event: TouchEvent) => {
        handleTouchMove(event, (x, y) => (mouse = { x, y }));
      };
      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchmove", onTouchMove, {passive: true});
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        if (disposed || loadingFailed) return;
        frame = requestAnimationFrame(animate);
        if (headBone && !reducedMotion) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp,
          );

          if (screenLight) light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer && !reducedMotion) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        clearTimeout(loadTimeout);
        progress.stop();
        mixer?.stopAllAction();
        scene.traverse(object => {
          const mesh = object as THREE.Mesh;
          mesh.geometry?.dispose();
          const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
          materials.forEach(material => material.dispose());
        });
        scene.environment?.dispose();
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", onResize);
        renderer.domElement.remove();
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchmove", onTouchMove);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  if (failed) return <p className="scene-fallback" role="status">3D preview unavailable. You can still explore the portfolio below.</p>;

  return (
    <>
      {slow && <p className="scene-fallback" role="status">The 3D preview is still loading. You can explore the portfolio while it finishes.</p>}
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;

