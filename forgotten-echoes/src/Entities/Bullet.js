import * as THREE from 'three'
import GameObject from '../gamebasics/GameObject';

let particleCount, positions, particleGeometry, particlesData, clock;

export default class Bullet extends GameObject {
    constructor(
        radius,
        position,
        target
    ) {
        super()
        this.radius = radius
        this.particles
        this.position = position
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 8), new THREE.MeshBasicMaterial({color: 0x0cfaf6}))
        console.log(this.position);
        this.mesh.position.set(this.position.x, this.position.y+1, this.position.z)

        this.lifetime = 2
        
        // Assuming you have two Vector3 points
        const point1 = position;
        const point2 = target.position;
        
        // Calculate the angle between the two points
        const deltaY = point2.z - point1.z;
        const deltaX = point2.x - point1.x;
        const angle = Math.atan2(deltaY, deltaX);
        
        // Calculate the velocity components
        
        // Convert angle from radians to degrees
        const angleDegrees = THREE.MathUtils.radToDeg(angle);
        
        console.log(`Angle between the points: ${angleDegrees} degrees`);
        const speed = 0.4
        var velocityX = Math.cos(angle) * speed;
        var velocityZ = Math.sin(angle) * speed;
        
        this.velocity = new THREE.Vector3(velocityX, 0, velocityZ)
        console.log(this.velocity);
        this.particles = new THREE.Group();
        this.addParticles()

        // const light = new THREE.PointLight( 0x0cfaf6, 0.5, 4 );
        // // light.position.set(this.position);
        // light.visible = false
        // this.mesh.add( light );
        // light.visible = true
    }

    addParticles() {
       // Create this.particles
       particleCount = 10;

       for (let i = 0; i < particleCount; i++) {
       const particle = new THREE.Mesh(
           new THREE.SphereGeometry(0.005, 8, 8),
           new THREE.MeshBasicMaterial({ color: 0x0cfaf6 })
       );

       // Randomly position this.particles
       const spread = 0.08
       particle.position.set(
           Math.random() * spread - spread,
           Math.random() * spread - spread,
           Math.random() * spread - spread
       );
       // Add random velocities for smoother animation
       const speed = 0.5;
       particle.velocity = new THREE.Vector3(
           this.velocity.x*speed*-1,
           this.velocity.y*speed*-1,
           this.velocity.z*speed*-1,
       );
       particle.lifetime = Math.random() * 0.2;

       this.particles.add(particle);
       }

       this.mesh.add(this.particles);


       // Animation variables
       clock = new THREE.Clock();
        
    }

    start(){
    }
    update() {
        this.mesh.position.add(this.velocity)
        const elapsedTime = clock.getElapsedTime();

        this.particles.children.forEach(particle => {
            // Add wavy motion along with random floating
            particle.position.add(particle.velocity);
            
            // Randomly change particle velocity direction over time
            
                particle.lifetime -= 0.016; // Adjust the decrement value based on your frame rate
                if (particle.lifetime <= 0) {
                    this.particles.remove(particle);
                }
          });
          this.addParticles()
          if (this.lifetime<=0) {
            this.destroy()
          }
          this.lifetime-=0.016
    }
}