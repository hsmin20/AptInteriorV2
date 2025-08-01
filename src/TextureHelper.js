import * as THREE from 'three';

class TextureHelper {
	constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.mapTexture = new Map();
        this.mapImage = new Map();

        this.allMap = new Map([
            ['Floor', './textures/floor.jpg'], ['Ceiling', './textures/ceiling.jpg'], ['Window', './textures/window.jpg'],
            ['SmallWindow', './textures/swindow.jpg'], ['InternalWindow', './textures/internalWindow.jpg'], ['RoomFloor', './textures/roomfloor.jpg'],
            ['Wallpaper1', './textures/wallpaper1.jpg'], ['PointWall', './textures/pointwall.jpg'], ['Tile', './textures/tile.jpg'],
            ['KitchenTile', './textures/kitchentile1.jpg'], ['DoorLeft', './textures/doorL.jpg'], ['DoorRight', './textures/doorR.jpg'],
            ['FrontDoorLeft', './textures/frontdoorL.jpg'], ['FrontDoorRight', './textures/frontdoorR.jpg'], ['Wood', './textures/wood.jpg'],
            ['Mattress', './textures/mattress.jpg'], ['Concrete', './textures/concrete.jpg'], ['GlassDoorLeft', './textures/glassDoorL.jpg'],
            ['GlassDoorRight', './textures/glassDoorR.jpg'], ['PinkPlastic', './textures/pinkPlastic.jpg'], ['PointWall2', './textures/pointwall2.jpg'],
            ['BalconyTile', './textures/balconytile.jpg'], ['KitchenSink', './textures/KitchenSink.jpg'], ['Marble', './textures/marble.jpg'],
            ['DrawerDoorLeft', './textures/drawerDoorL.jpg'], ['DrawerDoorRight', './textures/drawerDoorR.jpg'], ['GasRange', './textures/gasRange.jpg'],
            ['Light1', './textures/light1.jpg'], ['Light2', './textures/light2.jpg'], ['Light3', './textures/light3.jpg'], ['BlackMetal', './textures/blackmetal.jpg'],
            ['TV', './textures/tv.jpg']
        ]);
	}

    getFilepath(name) {
        return this.allMap.get(name);
    }
	
	get(name, repeatX, repeatY) {
        const textureName = name + "_" + repeatX + "_" + repeatY;
        if(this.mapTexture.has(textureName))
            return this.mapTexture.get(textureName);

        let texture;
        if(this.mapImage.has(name)) {
            texture = this.mapImage.get(name).clone();
        } else {
            texture = this.textureLoader.load(this.allMap.get(name));
        }

        this.mapImage.set(name, texture);

        texture.name = textureName;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);

        this.mapTexture.set(textureName, texture);

        return texture;
	}
}

export const textureHelper = new TextureHelper();