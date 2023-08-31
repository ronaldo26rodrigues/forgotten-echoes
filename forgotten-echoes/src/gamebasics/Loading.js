import * as THREE from 'three'
let instance;

class Loading extends THREE.LoadingManager {
    constructor() {
        if(instance) {
            throw new Error("Já existe uma instância desta classe")
        }
        super()
        instance = this;

        this.onStart = function(url, itemsLoaded, itemsTotal) {
            console.log(itemsLoaded);
            document.getElementById('loading').innerHTML = 'Carregando ' + ((itemsLoaded/itemsTotal)*100).toFixed(2) + '%' 
        }

        this.onProgress = function(url, itemsLoaded, itemsTotal) {
            document.getElementById('loading').innerHTML = 'Carregando ' + ((itemsLoaded/itemsTotal)*100).toFixed(2) + '%'
        }

        this.onLoad = function() {
            document.getElementById('loading').innerHTML = ''
        }
    }
}

let loadingInstance = new Loading()
export default loadingInstance