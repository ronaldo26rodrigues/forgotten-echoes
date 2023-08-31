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

export default class Level extends GameScene {

    constructor() {
        super()
        d=0
    }

    start() {
        

        clock = new THREE.Clock()
        
        this.background = new THREE.Color().setHex(0x87ceeb);
        const loader = new GLTFLoader(loadingInstance)

        // box = new Box(1, 1, 1)
        // const light = new AmbientLight(0xCCD5FF, 0.2)
        // const light = new AmbientLight(0xffffff, .1)
        // this.add(light)
        // this.add(girl.character)
        const hlight = new THREE.HemisphereLight( 0xECFF77, 0xF7AB40, .4 );
        this.add(hlight)

        // const l2 = new DirectionalLight(0xffffff, 1)
        const l2 = new DirectionalLight(0xffffff, 1)
        l2.position.set(200, 200, 200)
        this.add(l2)

        
        
        loader.load('/bosque1.glb', (bosque)=>{
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
        // pl = new PointLight(0x0000ff, 10, 5)
        // loader.load('/aranha.glb', (aranha)=>{
        //     aranha.scene.add(pl)
        //     pl.position.y = 8
        //     pl.position.x = -3
        //     this.add(aranha.scene)
        //     aranha.scene.scale.set(0.3, 0.3, 0.3)
        //     aranha.scene.position.set(0, -.5, 0)
        // })

        const tuqui = new Tuqui((tuqui)=>{
            tuqui.mesh.position.x=1
        }, this)

        


        const bosquepathfinding = new PathfindingUtil('/bosque1navmesh.glb', 'bosque', (pathfinding)=>{
            girl = new Girl((char)=>{this.add(char)}, this, pathfinding)
        })
        
        // Create particles
        particleCount = 500;
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
        

    }

    

     update() {
        d += 1
        // pl.intensity += Math.sin(d/10)
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
                particle.lifetime -= 0.016; // Adjust the decrement value based on your frame rate
                if (particle.lifetime <= 0) {
                    particles.remove(particle);
                }
          });
    }

}