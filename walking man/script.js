import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import {GLTFLoader} from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
let scene = new THREE.Scene();
scene.background=new THREE.Color(0xbfdfff);
let camera = new THREE.PerspectiveCamera(75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
camera.position.set(0,33,50)
let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
// LIGHT
scene.add(new THREE.AmbientLight(0xffffff,0.8));
let light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,20,10);
scene.add(light)
let snowTerrain;
const loader = new GLTFLoader();
loader.load("snow_terrain_low_poly.glb",(gltf)=>{
    snowTerrain = gltf.scene;

    snowTerrain.scale.set(10,10,10); // adjust if needed

    snowTerrain.position.set(0, -17, 0);

    scene.add(snowTerrain);
})
let modi;
let mixer;
loader.load(
    'narendra_modi_-_prime_minister_of_india.glb',
    (gltf)=> {
        modi = gltf.scene;
        modi.scale.set(25,25,25);
        modi.position.set(0,0,0);
        scene.add(modi);
        mixer=new THREE.AnimationMixer(modi);
        if (gltf.animations.length>0){
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        }
    }
)
let keys = {};

window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);
const clock = new THREE.Clock();
function Animate() {
    requestAnimationFrame(Animate);
    let delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
}
Animate();
