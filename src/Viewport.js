import * as THREE from 'three';

import { TransformControls } from 'three/addons/controls/TransformControls.js';

import { UIPanel } from './libs/ui.js';

import { EditorControls } from './EditorControls.js';
import { ViewportHelper } from './ViewportHelper.js';

import { SetPositionCommand } from './commands/SetPositionCommand.js';
import { SetRotationCommand } from './commands/SetRotationCommand.js';

// Don't know why but if this function is a class method, it won't work
var scope;
function onMouseUpFunc( event ) {
    const array = scope.getMousePosition( scope.container.dom, event.clientX, event.clientY );
    scope.onUpPosition.fromArray( array );

    scope.handleClick();

    document.removeEventListener( 'mouseup', onMouseUpFunc );
}

export class Viewport {
    constructor(editor) {
        scope = this;

        this.editor = editor;

        this.selector = editor.selector;

        this.container = new UIPanel();
        this.container.setId( 'viewport' );
	    this.container.setPosition( 'absolute' );

        this.renderer = null;

        this.camera = editor.camera;
	    this.scene = editor.scene;
        this.sceneHelpers = editor.sceneHelpers;

        this.grid = this.getGrid();

        this.viewportHelper = new ViewportHelper( this.camera, this.container );

        this.box = new THREE.Box3();
        this.selectionBox = new THREE.Box3Helper( this.box );
        this.selectionBox.material.depthTest = false;
        this.selectionBox.material.transparent = true;
        this.selectionBox.visible = false;
        this.sceneHelpers.add( this.selectionBox );

        this.onDownPosition = new THREE.Vector2();
        this.onUpPosition = new THREE.Vector2();
        this.container.dom.addEventListener( 'mousedown', this.onMouseDown.bind(this) );

        this.controls = new EditorControls( this.camera );

        const viewportScope = this;

        this.controls.addEventListener( 'change', function () {
            viewportScope.render();
	    } );

        this.viewportHelper.center = this.controls.center;

        this.clock = new THREE.Clock();

        let objectPositionOnDown = null;
        let objectRotationOnDown = null;

        this.createRenderer();

        this.transformControls = new TransformControls( this.camera, this.renderer.domElement );
        this.transformControls.setSize(0.25);
        this.transformControls.setMode('translate');
        

        this.transformControls.addEventListener( 'change', function () {
            viewportScope.onObjectChanged( viewportScope.transformControls.object );
        } );

        this.transformControls.addEventListener( 'mouseDown', function () {
            const object = viewportScope.transformControls.object;

            objectPositionOnDown = object.position.clone();
            objectRotationOnDown = object.rotation.clone();

            viewportScope.controls.enabled = false;
        } );

        this.transformControls.addEventListener( 'mouseUp', function () {
            const object = viewportScope.transformControls.object;

            if ( object !== undefined ) {
                switch ( viewportScope.transformControls.getMode() ) {
                    case 'translate':
                        if ( ! objectPositionOnDown.equals( object.position ) ) {
                            editor.execute( new SetPositionCommand( editor, object, object.position, objectPositionOnDown ) );
                        }
                        break;
                    case 'rotate':
                        if ( ! objectRotationOnDown.equals( object.rotation ) ) {
                            editor.execute( new SetRotationCommand( editor, object, object.rotation, objectRotationOnDown ) );
                        }
                        break;
                    default:
                        break;
                }
            }
            viewportScope.controls.enabled = true;
        } );

        this.sceneHelpers.add( this.transformControls );
    }

    getMousePosition( dom, x, y ) {

		const rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	handleClick() {
		if ( this.onDownPosition.distanceTo( this.onUpPosition ) === 0 ) {
			const intersects = this.selector.getPointerIntersects( this.onUpPosition, this.camera );
			this.selector.intersectionDetected( intersects );

			this.render();
		}
	}

	onMouseDown( event ) {
		// event.preventDefault();
		if ( event.target !== this.renderer.domElement ) return;

		const array = this.getMousePosition( this.container.dom, event.clientX, event.clientY );
		this.onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUpFunc );
	}

    createRenderer() {
		this.renderer = new THREE.WebGLRenderer( { alpha: true, } );

        this.controls.connect( this.renderer.domElement );

        this.renderer.setAnimationLoop(this.animate.bind(this));
		this.renderer.setClearColor( 0x223344 );

        this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize(this.container.dom.offsetWidth, this.container.dom.offsetHeight);

        this.container.dom.appendChild(this.renderer.domElement);
	}

    render() {
        // let startTime = 0;
	    // let endTime = 0;

		// startTime = performance.now();

		this.renderer.setViewport( 0, 0, this.container.dom.offsetWidth, this.container.dom.offsetHeight );
		this.renderer.render(this.scene, this.camera );

        this.renderer.autoClear = false;
		
        if ( this.grid.visible === true ) this.renderer.render( this.grid, this.camera );
        if ( this.sceneHelpers.visible === true ) this.renderer.render( this.sceneHelpers, this.camera );
        if ( this.renderer.xr.isPresenting !== true ) this.viewportHelper.render( this.renderer );

        this.renderer.autoClear = true;

		// endTime = performance.now();
	}

    
    animate() {
         // only used for animations
        const delta = this.clock.getDelta();

        let needsUpdate = false;
        
        // Happens when rgb of helper is clicked. It's rotated and stopped here.
        if ( this.viewportHelper.animating === true ) {
			this.viewportHelper.update( delta );
			needsUpdate = true;
		}

        // This function is called when animation happens. It's not called every time like game engine.
        if ( needsUpdate === true )
            this.render();
	}

    updateAspectRatio() {
        const aspect = this.container.dom.offsetWidth / this.container.dom.offsetHeight;

        if ( this.camera.isPerspectiveCamera ) {
            this.camera.aspect = aspect;
        } else {
            this.camera.left = - aspect;
            this.camera.right = aspect;
        }

        this.camera.updateProjectionMatrix();
	}

    windowResize() {
		this.updateAspectRatio();

		this.renderer.setSize(this.container.dom.offsetWidth, this.container.dom.offsetHeight );

		this.render();
	}

    getGrid() {
        const GRID_COLORS_LIGHT = [ 0x999999, 0x777777 ];

        const grid = new THREE.Group();

        const grid1 = new THREE.GridHelper( 30, 30 );
        grid1.material.color.setHex( GRID_COLORS_LIGHT[ 0 ] );
        grid1.material.vertexColors = true;
        grid.add( grid1 );

        const grid2 = new THREE.GridHelper( 30, 6 );
        grid2.material.color.setHex( GRID_COLORS_LIGHT[ 1 ] );
        grid2.material.vertexColors = false;
        grid.add( grid2 );

        const axesHelper = new THREE.AxesHelper(500);
        grid.add(axesHelper);

        return grid;
    }

    changeBackground(backgroundType, backgroundColor, backgroundTexture, backgroundEquirectangularTexture) {
        this.scene.background = null;

		switch ( backgroundType ) {
			case 'Color':
				this.scene.background = new THREE.Color( backgroundColor );
				break;
			case 'Texture':
				if ( backgroundTexture ) {
					this.scene.background = backgroundTexture;
				}

				break;
			case 'Equirectangular':
				if ( backgroundEquirectangularTexture ) {
					backgroundEquirectangularTexture.mapping = THREE.EquirectangularReflectionMapping;

					this.scene.background = backgroundEquirectangularTexture;
				}

				break;
		}

		// updatePTBackground();
		this.render();
    }

    onObjectSelected( object ) {
		this.selectionBox.visible = false;
        this.transformControls.detach();
		if ( object !== null && object !== this.scene && object !== this.camera ) {
			this.box.setFromObject( object, true );
			if ( this.box.isEmpty() === false ) {
				this.selectionBox.visible = true;
			}

            if(object.userData.isInterior == true && object.userData.interiorType != 'Wall')
                this.transformControls.attach( object );
		}

		this.render();
	}

    onObjectChanged( object ) {
		if ( this.editor.selected === object ) {
			this.box.setFromObject( object, true );
		}

		this.render();
	}
}