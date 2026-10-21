import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";


const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        let character: THREE.Object3D;
        loader.load(
          `${import.meta.env.BASE_URL}models/parth-coder-avatar-v1.0.glb?v=1`,
          async (gltf) => {
            try {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;

                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });



            const rightFoot = character.getObjectByName("footR");
            if (rightFoot) rightFoot.position.y = 3.36;
            const leftFoot = character.getObjectByName("footL");
            if (leftFoot) leftFoot.position.y = 3.36;
            resolve(gltf);

            // Monitor scale is handled by GsapScroll.ts animations

            } catch (error) { reject(error); }
            finally { dracoLoader.dispose(); }
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;

















