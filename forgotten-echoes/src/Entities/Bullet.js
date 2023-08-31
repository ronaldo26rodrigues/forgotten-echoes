import * as THREE from 'three'
import GameObject from '../gamebasics/GameObject';

let particleCount, positions, particleGeometry, particlesData, particles, clock;

export default class Bullet extends GameObject {
    constructor(
        radius,
        position,
        target
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

        const dif_x = position.x - target.x
        const dif_z = position.z - target.z

        const proportion = dif_x>=dif_z ? dif_x/dif_z : dif_z/dif_x
        console.log(dif_x, dif_z, proportion);
        const speed = 0.01

        this.velocity = new THREE.Vector3(speed*(dif_x/dif_z), 0, speed*(dif_z/dif_x))
        console.log(this.velocity);
        particles = new THREE.Group();
        this.addParticles()
        // this.mesh.add( light );
        // light.visible = true
    }

    addParticles() {
       // Create particles
       particleCount = 1;

       for (let i = 0; i < particleCount; i++) {
       const particle = new THREE.Mesh(
           new THREE.SphereGeometry(0.005, 8, 8),
           new THREE.MeshBasicMaterial({ color: 0x0000ff })
       );

       // Randomly position particles
       particle.position.set(
           Math.random() * 0.1 - 0.1,
           Math.random() * 0.1-0.1,
           Math.random() * 0.1 -0.1
       );
       // Add random velocities for smoother animation
       particle.velocity = new THREE.Vector3(
           this.velocity.x*0.1*-1,
           this.velocity.y*0.1*-1,
           this.velocity.z*0.1*-1,
       );
       particle.lifetime = Math.random() * 1;

       particles.add(particle);
       }

       this.mesh.add(particles);


       // Animation variables
       clock = new THREE.Clock();
        
    }

    start(){
    }
    update() {
        this.mesh.position.add(this.velocity)
        const elapsedTime = clock.getElapsedTime();

        particles.children.forEach(particle => {
            // Add wavy motion along with random floating
            particle.position.add(particle.velocity);
            
            // Randomly change particle velocity direction over time
            
                particle.lifetime -= 0.016; // Adjust the decrement value based on your frame rate
                if (particle.lifetime <= 0) {
                    particles.remove(particle);
                }
          });
          this.addParticles()
    }
}