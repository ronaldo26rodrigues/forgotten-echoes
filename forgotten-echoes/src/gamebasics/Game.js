import GameObject from "./GameObject";
import * as THREE from 'three'
import sceneManagerInstance from "./SceneManager";

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



let scene, camera, renderer;
let instance, composer;

export class Game extends GameObject {
    
    constructor() {
        super()
        if(instance) {
            throw new Error("Já existe uma instância desta classe")
        }
        instance = this;
        this.sceneManager = sceneManagerInstance;
        renderer = new THREE.WebGLRenderer( {
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
            depth: false
        } );
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        
        window.addEventListener( 'resize', this.onWindowResize, false );

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
        camera.position.set( 4, 6, 3 );
        camera.lookAt( this.sceneManager.currentScene.position );
        // camera.position.set( 2, 4, 2 );
        renderer.shadowMap.enabled = true
        // camera.zoom = 1.8
        composer = new EffectComposer( renderer );

     
    }
    
    start() {
        
    }
    
    async update() {
        if(renderer) renderer.render( sceneManagerInstance.currentScene, camera );
        if(composer) composer.render();
        
        
    }
    
    onWindowResize() {
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize( window.innerWidth, window.innerHeight );
        
    }
    getCamera() {
        return camera;
    }
    getRenderer() {
        return renderer
    }
    getComposer() {
        return composer
    }
}

let gameInstance = Object.freeze(new Game())
export default gameInstance;