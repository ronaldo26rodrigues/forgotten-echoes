import * as THREE from 'three'
import GameObject from '../gamebasics/GameObject';

export default class Box extends GameObject {
    constructor(
        width,
        height,
        depth
    ) {
        super()
        this.width = width
        this.height = height
        this.depth = depth

        this.mesh
    }

    start(){
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(this.width, this.height, this.depth), new THREE.MeshStandardMaterial({color: 0xFF0000}))
    }
    update() {
    }
}