import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import {GLTFLoader} from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
let scene = new THREE.Scene();
scene.background=new THREE.Color(0xbfdfff);
let camera = new THREE.PerspectiveCamera(75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
camera.position.set(0,5,15)
camera.rotation.set(0,90,0)
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
let mixer1;
let mixer2;
let walkaction;
let danceaction;
let putin;
loader.load(
    'narendra_modi_-_prime_minister_of_india.glb',
    (gltf)=> {
        modi = gltf.scene;
        modi.scale.set(25,25,25);
        modi.position.set(0,0,0);
        modi.rotation.set(0,0,0);
        scene.add(modi);
        mixer1=new THREE.AnimationMixer(modi);
        if (gltf.animations.length>0){
             walkaction = mixer1.clipAction(gltf.animations[0]);
            walkaction.stop();
        }
    }
)
loader.load(
    'vladimir_putin.glb',
    (gltf)=> {
        putin = gltf.scene;
        putin.scale.set(10,10,10);
        putin.position.set(750,0,450);
        putin.rotation.set(0,0,0);
        scene.add(putin);
         mixer2=new THREE.AnimationMixer(putin);
         if (gltf.animations.length>0){
             danceaction = mixer2.clipAction(gltf.animations[0]);
            danceaction.stop();
         }
    }
)
let keys = {};

window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);
function movePlayer(){
    if (!modi) return;
    let speed = 0.99;
    let moving = false;

    if (keys["w"]){
modi.translateZ(+speed);
moving=true
}
    if (keys["s"]){
modi.translateZ(-speed);
moving=true
}
    if (keys["ArrowLeft"] || keys["a"]) modi.rotation.y +=0.05;
    if (keys["ArrowRight"] || keys["d"])modi.rotation.y -=0.05
    if (walkaction){
        if (moving){
            walkaction.play();
        }else{
            walkaction.stop();
        }
    }
    }
    const raycaster = new THREE.Raycaster();
    const down = new THREE.Vector3(0,-1,0);
    function keepOnground(chr) {
        if (!chr || !snowTerrain )return;
        raycaster.set(
            new THREE.Vector3(
                chr.position.x,
                chr.position.y + 10,
                chr.position.z
            ),
            down
        );
        const intersects = raycaster.intersectObject(snowTerrain,true)
        if(intersects.length>0){
            let groundY = intersects[0].point.y;
            chr.position.y = groundY + 0.5;
        }
    }
    const cameraOffset=new THREE.Vector3(0,5,10);
    function updatecamera(){
        if (!modi) return;
        let offset = new THREE.Vector3(0,2,-3);
   let targetPosition = modi.localToWorld(offset.clone());
        camera.position.lerp(targetPosition, 0.1);    
        let lookDirection = new THREE.Vector3(0, 0, -1);    
        let lookTarget = modi.position.clone().add(lookDirection.multiplyScalar(10));
        camera.lookAt(lookTarget);
    }
    function checkCollision(){
        if(!putin || !modi )return;
        let distance = modi.position.distanceTo(putin.position);
        if(distance<2){
danceaction.play()
        }
        else{
            danceaction.stop()
        }
    }
const clock = new THREE.Clock();
function Animate() {
    requestAnimationFrame(Animate);
    let delta = clock.getDelta();
    if (mixer1) mixer1.update(delta);
     if (mixer2) mixer2.update(delta);
    movePlayer()
    keepOnground(modi)
    keepOnground(putin)
    updatecamera()
    //console.log(modi.position)
    renderer.render(scene, camera);
}
Animate();
