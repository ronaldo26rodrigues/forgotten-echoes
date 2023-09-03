import { AmbientLight, DirectionalLight, PointLight, Scene, SpotLight } from "three";
import Box from '../Entities/Box';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import {Pathfinding, PathfindingHelper} from 'three-pathfinding';
import gameInstance from "../gamebasics/Game";
import gameEngineInstance from "../gamebasics/GameEngine";
import Girl from "../Entities/Girl";
import GameScene from "../gamebasics/GameScene";
import PathfindingUtil from "../util/PathFindingUtil";
import Tuqui from "../Entities/Tuqui";
import loadingInstance from "../gamebasics/Loading";

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';

import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import sceneManagerInstance from "../gamebasics/SceneManager";
import { Vector3 } from "yuka";

let box, clock, girl, pl, d

let navmesh;
let groupId;
let navpath;

let particleCount, positions, particleGeometry, particles;


const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-2, 0, -2),
    new THREE.Vector3(-1, 2, -1),
    new THREE.Vector3(1, 2, 1),
    new THREE.Vector3(2, 0, 2)
);

export default class Level2 extends GameScene {

    constructor() {
        super()
        d=0
    }

    start() {
        

        clock = new THREE.Clock()
        
        this.background = new THREE.Color().setHex(0x111111);
        const loader = new GLTFLoader(loadingInstance)

        // box = new Box(1, 1, 1)
        // const light = new AmbientLight(0xCCD5FF, 0.2)
        // const light = new AmbientLight(0xffffff, .1)
        // this.add(light)
        // this.add(girl.character)
        const hlight = new THREE.HemisphereLight( 0xECFF77, 0xF7AB40, .1 );
        this.add(hlight)
        // hlight.castShadow=true

        // const l2 = new DirectionalLight(0xffffff, 1)
        const l2 = new DirectionalLight(0xebebeb, 0.04)
        l2.position.set(10, 20, 5)
        this.add(l2)
        l2.castShadow=true

        l2.shadow.mapSize.set( 2048, 2048);
        const d = 15;

        l2.shadow.camera.left = - d;
        l2.shadow.camera.right = d;
        l2.shadow.camera.top = d;
        l2.shadow.camera.bottom = - d;
        // this.add( new THREE.CameraHelper( l2.shadow.camera ) );

        
        
        loader.load('/bosque2.glb', (bosque)=>{
            this.add(bosque.scene)
            bosque.scene.receiveShadow = true
            
            
            bosque.scene.traverse( child => {
                
                if ( child.material ) child.material.metalness = 0;
                if(child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            } );
        })
        
        const area = 10;
        const numb = 10
        for (let i = 0; i < numb; i++) {
            const tuqui = new Tuqui((tuqui)=>{
                tuqui.mesh.position.set(Math.random()*area-area/2, 1, Math.random()*area-area/2)
                
            }, this)
        }

        


        const bosquepathfinding = new PathfindingUtil('/bosque2navmesh.glb', 'bosque', (pathfinding, _, navmesh)=>{
            girl = new Girl((char)=>{this.add(char)}, this, pathfinding)
            navmesh.visible = false
            this.add(navmesh)
        })
        
        // Create particles
        particleCount = 200;
        particles = new THREE.Group();

        for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.005, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );

        // Randomly position particles
        particle.position.set(
            Math.random() * 20 - 10,
            Math.random() * 5,
            Math.random() * 20 -10
        );
        // Add random velocities for smoother animation
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );

        particle.lifetime = Math.random() * 1;

        particles.add(particle);
        }

        this.add(particles);


        // Animation variables
        clock = new THREE.Clock();
        
        const composer = gameInstance.getComposer()

        const renderPass = new RenderPass( this, gameInstance.getCamera() );
        composer.addPass( renderPass );

        // const renderPixelatedPass = new RenderPixelatedPass( 1, this, gameInstance.getCamera() );
		// composer.addPass( renderPixelatedPass );
        // renderPixelatedPass.normalEdgeStrength = 0

        const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 0.4, 0.85)
        composer.addPass(bloom)

        const outputPass = new OutputPass();
        gameInstance.getComposer().addPass( outputPass );

    }

    

     update() {
        
        // pl.intensity -=0.1
        const elapsedTime = clock.getElapsedTime();

        particles.children.forEach(particle => {
            // Add wavy motion along with random floating
            particle.position.add(particle.velocity);
            
            // Randomly change particle velocity direction over time
            if (Math.random() < 0.01) {
                particle.velocity.set(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                    );
                }
                
          });
          
    }

}