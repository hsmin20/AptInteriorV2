import * as THREE from 'three';

import { UIPanel, UIBreak, UIRow, UIColor, UISelect, UIText, UIButton, UICheckbox } from './libs/ui.js';
import { UIOutliner, UITexture } from './libs/ui.three.js';

import { saveState } from './AptInterior.js';

export class SidebarScene {
    constructor( editor, viewport ) {
        this.editor = editor;
        this.viewport = viewport;

        this.container = new UIPanel();
        this.container.setBorderTop( '0' );
        this.container.setPaddingTop( '20px' );

        // outliner

        this.nodeStates = new WeakMap();

        this.ignoreObjectSelectedSignal = false;

        this.outliner = new UIOutliner( editor );
        this.outliner.setId( 'outliner' );

        let outliner2 = this.outliner;
        let ignoreOSS = this.ignoreObjectSelectedSignal;
        this.outliner.onChange( function () {
            ignoreOSS = true;
            editor.selectById( parseInt( outliner2.getValue() ) );
            ignoreOSS = false;
        } );

        this.container.add( this.outliner );
        this.container.add( new UIBreak() );

        // background
        const backgroundRow = new UIRow();

        this.backgroundType = new UISelect().setOptions( {
            'None': 'None',
            'Color': 'Color',
            'Texture': 'Texture',
            'Equirectangular': 'VR360'
        } ).setWidth( '150px' );

        var backgroundTypeChangedFunc = this.backgroundTypeChanged.bind(this);
        this.backgroundType.onChange( backgroundTypeChangedFunc );

        var backgroundChangedFunc = this.onBackgroundChanged.bind(this);

        // backgroundRow.add( new UIText( strings.getKey( 'sidebar/scene/background' ) ).setClass( 'Label' ) );
        backgroundRow.add( new UIText( 'Background').setClass( 'Label' ) );
        backgroundRow.add( this.backgroundType );

        this.backgroundColor = new UIColor().setValue( '#000000' ).setMarginLeft( '8px' ).onInput( backgroundChangedFunc );
        backgroundRow.add( this.backgroundColor );

        this.backgroundTexture = new UITexture( editor ).setMarginLeft( '8px' ).onChange( backgroundChangedFunc );
        this.backgroundTexture.setDisplay( 'none' );
        backgroundRow.add( this.backgroundTexture );

        this.backgroundEquirectangularTexture = new UITexture( editor ).setMarginLeft( '8px' ).onChange( backgroundChangedFunc );
        this.backgroundEquirectangularTexture.setDisplay( 'none' );
        backgroundRow.add( this.backgroundEquirectangularTexture );

        this.container.add( backgroundRow );

        // Grid Helpers
        const helpersRow = new UIRow();
        const helpers = new UICheckbox(true).onChange( function () {
            viewport.grid.visible = !viewport.grid.visible;
            viewport.render();
        });

        helpersRow.add( new UIText( 'Helpers' ).setClass( 'Label' ) );
        helpersRow.add( helpers );

        this.container.add( helpersRow );

        this.refreshUI();
    }

    backgroundTypeChanged() {
        this.onBackgroundChanged();
        this.refreshBackgroundUI();
    }

	buildOption( object, draggable ) {
		const option = document.createElement( 'div' );
		option.draggable = draggable;
		option.innerHTML = this.buildHTML( object );
		option.value = object.id;

		// opener
		if ( this.nodeStates.has( object ) ) {
			const state = this.nodeStates.get( object );

			const opener = document.createElement( 'span' );
			opener.classList.add( 'opener' );
			if ( object.children.length > 0 ) {
				opener.classList.add( state ? 'open' : 'closed' );
			}

            var ns = this.nodeStates;
            var scope = this;
			opener.addEventListener( 'click', function () {
				ns.set( object, ns.get( object ) === false ); // toggle
				scope.refreshUI();
			} );

			option.insertBefore( opener, option.firstChild );
		}
		return option;
	}

	getMaterialName( material ) {
		if ( Array.isArray( material ) ) {
			const array = [];
			for ( let i = 0; i < material.length; i ++ ) {
				array.push( material[ i ].name );
			}

			return array.join( ',' );
		}
		return material.name;
	}

	escapeHTML( html ) {
		return html
			.replace( /&/g, '&amp;' )
			.replace( /"/g, '&quot;' )
			.replace( /'/g, '&#39;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' );
	}

	getObjectType( object ) {
		if ( object.isScene ) return 'Scene';
		if ( object.isCamera ) return 'Camera';
		if ( object.isLight ) return 'Light';
        if ( object.isGroup ) return 'Group';
		if ( object.isMesh ) {
            const name = object.name.toLowerCase();
            if(name.includes('window'))
                return 'Window';
            if(name.includes('door'))
                return 'Door';
            if(name.includes('wall'))
                return 'Wall';
            if(name.includes('floor'))
                return 'Floor';
            return 'Mesh';
        }
		if ( object.isLine ) return 'Line';
		if ( object.isPoints ) return 'Points';

		return 'Object3D';
	}

	buildHTML( object ) {
		let html = `<span class="type ${ this.getObjectType( object ) }"></span> ${ this.escapeHTML( object.name ) }`;

		return html;
	}
	
	onBackgroundChanged() {
		var type = this.backgroundType.getValue();
        var col = this.backgroundColor.getHexValue();
        var texture = this.backgroundTexture.getValue();
        var equiTexture = this.backgroundEquirectangularTexture.getValue();

        this.viewport.changeBackground(type, col, texture, equiTexture);

        saveState(); // from AptInterior.js
	}

	refreshBackgroundUI() {
		const type = this.backgroundType.getValue();

		this.backgroundType.setWidth( type === 'None' ? '150px' : '110px' );
		this.backgroundColor.setDisplay( type === 'Color' ? '' : 'none' );
		this.backgroundTexture.setDisplay( type === 'Texture' ? '' : 'none' );
		this.backgroundEquirectangularTexture.setDisplay( type === 'Equirectangular' ? '' : 'none' );
	}

	//

    addObjects( objectArray, pad, options ) {
        for ( let i = 0; i < objectArray.length; i ++ ) {
            const object = objectArray[ i ];

            // In Interior, show the rooms and iteriors only
            const parent = object.parent;
            if(parent !== this.editor.scene && object.userData.isInterior != true)
                continue;

            if ( this.nodeStates.has( object ) === false ) {
                this.nodeStates.set( object, false );
            }

            const option = this.buildOption( object, true );
            option.style.paddingLeft = ( pad * 18 ) + 'px';
            options.push( option );

            if ( this.nodeStates.get( object ) === true ) {
                this.addObjects( object.children, pad + 1, options );
            }
        }
    }

	refreshUI() {
		// const camera = this.editor.camera;
		const scene = this.editor.scene;

		const options = [];

		// options.push( this.buildOption( camera, false ) );
        let sceneOpt = this.buildOption( scene, false );
		options.push( sceneOpt );

		this.addObjects( scene.children, 0, options );

		this.outliner.setOptions( options );

		if ( this.editor.selected !== null ) {
			this.outliner.setValue( this.editor.selected.id );
		}

		if ( scene.background ) {
			if ( scene.background.isColor ) {
				this.backgroundType.setValue( 'Color' );
				this.backgroundColor.setHexValue( scene.background.getHex() );
			} else if ( scene.background.isTexture ) {
				if ( scene.background.mapping === THREE.EquirectangularReflectionMapping ) {
					this.backgroundType.setValue( 'Equirectangular' );
					this.backgroundEquirectangularTexture.setValue( scene.background );
				} else {
					this.backgroundType.setValue( 'Texture' );
					this.backgroundTexture.setValue( scene.background );
				}
			}
		} else {
			this.backgroundType.setValue( 'None' );
			this.backgroundTexture.setValue( null );
			this.backgroundEquirectangularTexture.setValue( null );
		}

		this.refreshBackgroundUI();
	}

    onObjectSelected( object ) {
		if ( this.ignoreObjectSelectedSignal === true ) 
            return;

		if ( object !== null && object.parent !== null ) {
			let needsRefresh = false;
			let parent = object.parent;
			while ( parent !== this.editor.scene ) {
				if ( this.nodeStates.get( parent ) !== true ) {
					this.nodeStates.set( parent, true );
					needsRefresh = true;
				}
				parent = parent.parent;
			}

			if ( needsRefresh ) 
                this.refreshUI();
            this.outliner.setValue( object.id );
		} else {
			this.outliner.setValue( null );
		}
	}
}

