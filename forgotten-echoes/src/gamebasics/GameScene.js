import * as THREE from 'three'
import gameEngineInstance from './GameEngine'

export default class GameScene extends THREE.Scene {
    constructor() {
        super()
        gameEngineInstance.start(this)
        this.enabled = true
    }

    start() {

    }
    update(){

    }
}