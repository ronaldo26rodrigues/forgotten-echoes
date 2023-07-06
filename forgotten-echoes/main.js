import Box from './src/Entities/Box';
import Level from './src/Scenes/Level';
import gameInstance from './src/gamebasics/Game';
import './style.css'
import * as THREE from 'three'





const box = new Box(1, 1, 1)

const scene = new THREE.Scene()
gameInstance.sceneManager.loadScene(scene)
gameInstance.sceneManager.currentScene.add(box.mesh)

const level = new Level()

gameInstance.sceneManager.loadScene(level)