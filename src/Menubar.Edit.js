import * as THREE from 'three';
import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

import { RemoveObjectCommand } from './commands/RemoveObjectCommand.js';

import { roomInterior } from './RoomInterior.js';

export class MenubarEdit {
    constructor( editor ) {
        const self = this;
        const editorscope = editor;

        this.container = new UIPanel();
        this.container.setClass( 'menu' );

        const title = new UIPanel();
        title.setClass( 'title' );
        title.setTextContent( 'Edit' );
        this.container.add( title );

        const options = new UIPanel();
        options.setClass( 'options' );
        this.container.add( options );

        // Room
        const roomSubmenuTitle = new UIRow().setTextContent( 'Room' ).addClass( 'option' ).addClass( 'submenu-title' );
        roomSubmenuTitle.onMouseOver( function () {
            const { top, right } = roomSubmenuTitle.dom.getBoundingClientRect();
            const { paddingTop } = getComputedStyle( this.dom );
            roomSubmenu.setLeft( right + 'px' );
            roomSubmenu.setTop( top - parseFloat( paddingTop ) + 'px' );
            roomSubmenu.setStyle( 'max-height', [ `calc( 100vh - ${top}px )` ] );
            roomSubmenu.setDisplay( 'block' );
        } );
        roomSubmenuTitle.onMouseOut( function () {
            roomSubmenu.setDisplay( 'none' );
        } );
        options.add( roomSubmenuTitle );

        const roomSubmenu = new UIPanel().setPosition( 'fixed' ).addClass( 'options' ).setDisplay( 'none' );
        roomSubmenuTitle.add( roomSubmenu );

        let option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Add a TV' );
        option.onClick( function () {
            if(editorscope.selected == null) {
                alert('Select an item first');
                return;
            }

            if(editorscope.selected.type != 'Group') {
                alert('Select a Group');
                return;
            }
            roomInterior.addTV(editorscope);
        } );
        roomSubmenu.add( option );

        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Add a Sofa' );
        option.onClick( function () {
            if(editorscope.selected == null) {
                alert('Select an item first');
                return;
            }

            if(editorscope.selected.type != 'Group') {
                alert('Select a Group');
                return;
            }
            roomInterior.addSofa(editorscope);
        } );
        roomSubmenu.add( option );

        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Add a Bed' );
        option.onClick( function () {
            if(editorscope.selected == null) {
                alert('Select an item first');
                return;
            }

            if(editorscope.selected.type != 'Group') {
                alert('Select a Group');
                return;
            }
            roomInterior.addBed(editorscope);
        } );
        roomSubmenu.add( option );

        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Add a Desk' );
        option.onClick( function () {
            if(editorscope.selected == null) {
                alert('Select an item first');
                return;
            }

            if(editorscope.selected.type != 'Group') {
                alert('Select a Group');
                return;
            }
            roomInterior.addDesk(editorscope);
        } );
        roomSubmenu.add( option );

        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Add a Bookshelf' );
        option.onClick( function () {
            if(editorscope.selected == null) {
                alert('Select an item first');
                return;
            }

            if(editorscope.selected.type != 'Group') {
                alert('Select a Group');
                return;
            }
            roomInterior.addBookshelf(editorscope);
        } );
        roomSubmenu.add( option );

        // Kitchen
        const kitchenSubmenuTitle = new UIRow().setTextContent( 'Kitchen' ).addClass( 'option' ).addClass( 'submenu-title' );
        kitchenSubmenuTitle.onMouseOver( function () {
            const { top, right } = kitchenSubmenuTitle.dom.getBoundingClientRect();
            const { paddingTop } = getComputedStyle( this.dom );
            kitchenSubmenu.setLeft( right + 'px' );
            kitchenSubmenu.setTop( top - parseFloat( paddingTop ) + 'px' );
            kitchenSubmenu.setStyle( 'max-height', [ `calc( 100vh - ${top}px )` ] );
            kitchenSubmenu.setDisplay( 'block' );

        } );
        kitchenSubmenuTitle.onMouseOut( function () {

            kitchenSubmenu.setDisplay( 'none' );

        } );
        options.add( kitchenSubmenuTitle );

        const kitchenSubmenu = new UIPanel().setPosition( 'fixed' ).addClass( 'options' ).setDisplay( 'none' );
        kitchenSubmenuTitle.add( kitchenSubmenu );

        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Add a Refrigerator' );
        option.onClick( function () {
            if(editorscope.selected == null) {
                alert('Select an item first');
                return;
            }
             if(editorscope.selected.type != 'Group') {
                alert('Select a Group');
                return;
            }

            roomInterior.addRefrigerator(editorscope);
        } );
        kitchenSubmenu.add( option );

        options.add( new UIHorizontalRule() );

        // Remove
        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Remove' );
        option.onClick( function () {
            if(editorscope.selected == null) {
                alert('Select an item first');
                return;
            }

            if (confirm('Are you sure you want to remove this item?')) {
                const object = editorscope.selected;
                if ( object !== null && object.parent !== null ) {
                    editorscope.execute( new RemoveObjectCommand( editorscope, object ) );
                }  
            }
        } );
        options.add( option );
    }
}
