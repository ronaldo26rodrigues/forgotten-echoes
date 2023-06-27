import Box from './src/Entities/Box';
import GameBase from './src/gamebasics/GameBase';
import './style.css'
import * as THREE from 'three'



const gameBase = new GameBase()

const box = new Box(1, 1, 1)

gameBase.addToScene(box.mesh)
