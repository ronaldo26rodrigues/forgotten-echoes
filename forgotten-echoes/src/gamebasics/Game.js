import GameObject from "./GameObject";
import * as THREE from 'three'
import sceneManagerInstance from "./SceneManager";

let scene, camera, renderer;


export default class Game extends GameObject {
    
    constructor() {
        super()
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
        camera.position.set( 3, 8, 3 );
        
        
     
    }
    
    start() {
        
    }
    
    update() {
        if(renderer) renderer.render( sceneManagerInstance.currentScene, camera );
    }
    
    onWindowResize() {
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize( window.innerWidth, window.innerHeight );
        
    }
}