import * as THREE from 'three'
import GameObject from '../gamebasics/GameObject';

let particleCount, positions, particleGeometry, particlesData, particles;

export default class Bullet extends GameObject {
    constructor(
        radius,
        position
    ) {
        super()
        this.radius = radius

        this.mesh
        this.position = position
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 8), new THREE.MeshStandardMaterial({color: 0x0000ff}))
        console.log(this.position);
        this.mesh.position.set(this.position.x, this.position.y+1, this.position.z)

        // const light = new THREE.PointLight( 0x0000ff, 0.5, 10 );
        // // light.position.set(this.position);
        // light.visible = false
        // this.mesh.add( light );

        
    }

    addParticles() {
        // Create particle material and geometry
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05-Math.random()*0.01,
            map: new THREE.TextureLoader().load("/sparkle.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
            
        });
        // Define particle properties including position, velocity, and lifetime
        console.log(particlesData);
        particleGeometry = new THREE.BufferGeometry();
        particleCount = 10
        positions = new Float32Array(particleCount * 3);
        particlesData = [];
        for (let i = 0; i < particleCount; i++) {
            particlesData.push({
                age: 0 // Initial age
            });
        }

        // Set random initial positions for particles
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (this.position.x+Math.random()*0.1);
            positions[i * 3 + 1] = (this.position.y+1);
            positions[i * 3 + 2] = (this.position.z+Math.random()*0.1);
        }

        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        particles = new THREE.Points(particleGeometry, particleMaterial);
        this.mesh.parent.add(particles);
        
    }

    start(){
    }
    update() {
        this.mesh.position.x += 0.1
        for (let i = 0; i < particleCount; i++) {
            const particle = particlesData[i];
            particle.age += 1;

        if (particle.age > 60) { // Assuming 60 frames per second
            // Remove particle from scene and array after 1 second
            particles.parent.remove(particles)
            particlesData.splice(i, 1);
            particle.age = 0;
            i--; // Adjust index after removing a particle
        } else {
            positions[i * 3] += (Math.random() - 0.5) * 0.025;
            positions[i * 3 + 1] += (Math.random() - 0.5) * 0.025;
            positions[i * 3 + 2] += (Math.random() - 0.5) * 0.025;

        }// if (positions[i * 3 + 1]>30) positions[i * 3 + 1] = 0 
    }
    particleGeometry.attributes.position.needsUpdate = true;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (this.mesh.position.x+Math.random()*0.1);
        positions[i * 3 + 1] = (this.mesh.position.y);
        positions[i * 3 + 2] = (this.mesh.position.z+Math.random()*0.1);
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles = new THREE.Points(particleGeometry, particleMaterial);
    
    this.mesh.parent.add(particles);
    }
}