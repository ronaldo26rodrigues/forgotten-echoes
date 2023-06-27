import GameObject from "./GameObject";
import * as THREE from 'three'

let scene, camera, renderer;


export default class GameBase extends GameObject {
    
    
    start() {
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
        camera.position.set( 3, 6, 3 );
        camera.lookAt( scene.position );
        camera.position.set( 3, 8, 3 );
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        
        //
        
        window.addEventListener( 'resize', this.onWindowResize, false );
        
        const light = new THREE.AmbientLight(0xffffff)
        
        scene.add(light)
    }
    addToScene(obj) {
        scene.add(obj)
    }
    
    update() {
        if(renderer) renderer.render( scene, camera );
    }
    
    onWindowResize() {
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize( window.innerWidth, window.innerHeight );
        
    }
}