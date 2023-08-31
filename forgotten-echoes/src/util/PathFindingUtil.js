import { Pathfinding } from "three-pathfinding";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class PathfindingUtil {
    constructor(navmeshobjname, ZONE, onLoad=()=>{}) {
        const loader = new GLTFLoader()
        this.pathfinding = new Pathfinding()
        this.navmesh = null
        this.ZONE = ZONE
        loader.load(navmeshobjname, (bosque_navmesh)=>{
            bosque_navmesh.scene.traverse(node=>{
                node.name = 'navmesh_object'
                if(!this.navmesh && node.isObject3D && node.children && node.children.length > 0) {
                    this.navmesh = node.children[0]
                    this.pathfinding.setZoneData(ZONE, Pathfinding.createZone(this.navmesh.geometry))


                }
            })
            onLoad(this, this.pathfinding, this.navmesh, this.ZONE)
        })
    }
}