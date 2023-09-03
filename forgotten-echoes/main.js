import Box from './src/Entities/Box';
import Level from './src/Scenes/Level';
import Level2 from './src/Scenes/Level2';
import gameInstance from './src/gamebasics/Game';
import './style.css'
import * as THREE from 'three'





// const box = new Box(1, 1, 1)

// const scene = new THREE.Scene()
// gameInstance.sceneManager.loadScene(scene)
// gameInstance.sceneManager.currentScene.add(box.mesh)


gameInstance.sceneManager.loadScene(Level)