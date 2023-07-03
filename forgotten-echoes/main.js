import Box from './src/Entities/Box';
import Level from './src/Scenes/Level';
import Game from './src/gamebasics/Game';
import './style.css'
import * as THREE from 'three'



const gameBase = new Game()

const box = new Box(1, 1, 1)

const scene = new THREE.Scene()
gameBase.sceneManager.loadScene(scene)
gameBase.sceneManager.currentScene.add(box.mesh)

const level = new Level()

gameBase.sceneManager.loadScene(level)