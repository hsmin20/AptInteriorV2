import * as THREE from 'three';

import { History as _History } from './History.js';
import { Storage as _Storage } from './Storage.js';
import { Selector } from './Selector.js';

import { RemoveObjectCommand } from './commands/RemoveObjectCommand.js';

import { saveState } from './AptInterior.js';

import { textureHelper } from './TextureHelper.js';

var _DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );
_DEFAULT_CAMERA.name = 'Camera';
_DEFAULT_CAMERA.position.set( 0, 5, 10 );
_DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

export class Editor {
    constructor(scene_name) {
        this.camera = _DEFAULT_CAMERA.clone();

        this.scene = new THREE.Scene();
	    this.scene.name = scene_name;

        // separate scene for selection box
        this.sceneHelpers = new THREE.Scene();
	    this.sceneHelpers.add( new THREE.HemisphereLight( 0xffffff, 0x888888, 2 ) );

        // this.mixer = new THREE.AnimationMixer( this.scene );

        this.selected = null;

        this.history = new _History( this );
        this.selector = new Selector( this );
        this.storage = new _Storage();

        this.geometries = {};
        this.materials = {};
        this.textures = {};

        this.materialsRefCounter = new Map();

        let keyDownFunc = this.keyDown.bind(this);
        document.addEventListener( 'keydown', keyDownFunc);
    }

    setViewport(viewport) {
        this.viewport = viewport;
    }

    setSidebar(sidebar) {
        this.sidebar = sidebar;
    }

    setScene(scene) {

		this.scene.uuid = scene.uuid;
		this.scene.name = scene.name;

		this.scene.background = scene.background;
		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

		// avoid render per object
		while ( scene.children.length > 0 ) {
			this.addObject( scene.children[ 0 ], null, false );
		}
	}

    addObject( object, parent, refresh=true ) {
        var scope = this;
		object.traverse( function ( child ) {
			if ( child.geometry !== undefined ) 
                scope.addGeometry( child.geometry );
			
            if ( child.material !== undefined ) 
                scope.addMaterial( child.material );
		} );

		if ( parent == null || parent === undefined ) {
			this.scene.add( object );
		} else {
			parent.children.push( object );
			object.parent = parent;
		}

        saveState();

        if(refresh) {
            this.sidebar.refreshUI();
            this.viewport.render();
        }
	}

    addGeometry( geometry ) {
		this.geometries[ geometry.uuid ] = geometry;
	}

    addMaterial( material ) {
		if ( Array.isArray( material ) ) {
			for ( var i = 0, l = material.length; i < l; i ++ ) {
				this.addMaterialToRefCounter( material[ i ] );
			}
		} else {
			this.addMaterialToRefCounter( material );
		}
		// this.signals.materialAdded.dispatch();
	}

    addMaterialToRefCounter( material ) {
		var materialsRefCounter = this.materialsRefCounter;
		var count = materialsRefCounter.get( material );
		if ( count === undefined ) {
			materialsRefCounter.set( material, 1 );
			this.materials[ material.uuid ] = material;
		} else {
			count ++;
			materialsRefCounter.set( material, count );
		}
	}

    removeObject( object ) {
		if ( object.parent === null ) return; // avoid deleting the camera or scene

		var scope = this;
		object.traverse( function ( child ) {
			// scope.removeCamera( child );
			// scope.removeHelper( child );

			if ( child.material !== undefined ) 
                scope.removeMaterial( child.material );
		} );

		object.parent.remove( object );

        saveState();
        this.sidebar.refreshUI();
        this.viewport.render();
	}

    removeMaterial( material ) {
		if ( Array.isArray( material ) ) {
			for ( var i = 0, l = material.length; i < l; i ++ ) {
				this.removeMaterialFromRefCounter( material[ i ] );
			}
		} else {
			this.removeMaterialFromRefCounter( material );
		}
		// this.signals.materialRemoved.dispatch();
	}

	removeMaterialFromRefCounter( material ) {
		var materialsRefCounter = this.materialsRefCounter;
		var count = materialsRefCounter.get( material );
		count --;
		if ( count === 0 ) {
			materialsRefCounter.delete( material );
			delete this.materials[ material.uuid ];
		} else {
			materialsRefCounter.set( material, count );
		}
	}

    clear() {
        this.storage.clear();

        this.camera.copy( _DEFAULT_CAMERA );

        this.scene.name = 'Scene';
		this.scene.background = null;

		var objects = this.scene.children;

		while ( objects.length > 0 ) {
			this.removeObject( objects[ 0 ] );
		}

		this.geometries = {};
		this.materials = {};
		this.textures = {};
		// this.scripts = {};

		this.materialsRefCounter.clear();

		this.deselect();
    }

    async fromJSON ( json ) {
		var loader = new THREE.ObjectLoader(); // A loader for loading a JSON resource
		var camera = await loader.parseAsync( json.camera );

		// copy all properties, including uuid
		this.camera.copy( camera );
		this.camera.uuid = camera.uuid;

		this.setScene( await loader.parseAsync( json.scene ) );

        saveState();
        this.sidebar.refreshUI();
        this.viewport.render();
	}

    toJSON () {
		return {
			metadata: {},
			camera: this.camera.toJSON(),
			scene: this.scene.toJSON()
		};
	}

	toJSON2 () {
		let json =  {
			metadata: {},
			camera: this.camera.toJSON(),
			scene: this.scene.toJSON()
		};

        let textures = json.scene.textures;
        let images = json.scene.images;
        if(textures == undefined || images == undefined)
            return json;

        textures.forEach(function(texture) {
            const imageUUID = texture.image;

            const name = texture.name;
            const index = name.indexOf("_");
            const textureName = name.substring(0, index);
            const imagePath = textureHelper.getFilepath(textureName);

            images.forEach(function(image) {
                const uuid = image.uuid;
                if(imageUUID == uuid) {
                    image.url = imagePath;
                }
            });
        });

        return json;
	}

    execute( cmd, optionalName ) {
		this.history.execute( cmd, optionalName );
	}

    undo() {
		this.history.undo();
	}

	redo() {
		this.history.redo();
	}

    keyDown( event ) {
		switch ( event.key.toLowerCase() ) {
			case 'delete':
				const object = this.selected;
				if ( object === null ) return;

                if (confirm('Are you sure you want to remove this item?')) {
                    const parent = object.parent;
                    if ( parent !== null ) 
                        this.execute( new RemoveObjectCommand( this, object ) );
                }

				break;
			case 'z':
				if ( event.ctrlKey ) {
					event.preventDefault(); // Prevent browser specific hotkeys
					this.undo();
				}

				break;
            case 'y':
				if ( event.ctrlKey ) {
					event.preventDefault(); // Prevent browser specific hotkeys
					this.redo();
				}

				break;
		}
	}

    select( object ) {
		this.selector.select( object );

        this.onSelected( object );
	}

    onSelected( object ) {
        this.sidebar.onObjectSelected( object );
        this.viewport.onObjectSelected( object );
    }

    selectById( id ) {
		this.select( this.scene.getObjectById( id ) );
	}

	selectByUuid( uuid ) {
		var scope = this;
		this.scene.traverse( function ( child ) {
			if ( child.uuid === uuid ) {
				scope.select( child );
			}
		} );
	}

    deselect() {
		this.selector.deselect();
	}

    objectChanged( object ) {
        saveState();
        this.sidebar.refreshUI( object );
        this.viewport.onObjectChanged( object );
    }
}