import GameObject from "./GameObject";
import * as THREE from 'three'
import sceneManagerInstance from "./SceneManager";

let scene, camera, renderer;
let instance;

class Game extends GameObject {
    
    constructor() {
        super()
        if(instance) {
            throw new Error("Já existe uma instância desta classe")
        }
        instance = this;
        this.sceneManager = sceneManagerInstance;
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        
        window.addEventListener( 'resize', this.onWindowResize, false );

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
        camera.position.set( 3, 6, 3 );
        camera.lookAt( this.sceneManager.currentScene.position );
        camera.position.set( 2, 4, 2 );
        renderer.shadowMap.enabled = true
        
     
    }
    
    start() {
        
    }
    
    async update() {
        if(renderer) renderer.render( sceneManagerInstance.currentScene, camera );
    }
    
    onWindowResize() {
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize( window.innerWidth, window.innerHeight );
        
    }
    getCamera() {
        return camera;
    }
}

let gameInstance = new Game()
export default gameInstance;