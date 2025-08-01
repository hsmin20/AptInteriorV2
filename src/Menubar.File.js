import * as THREE from 'three';
import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

export class MenubarFile {
    constructor( editor ) {
        this.container = new UIPanel();
        this.container.setClass( 'menu' );

        const title = new UIPanel();
        title.setClass( 'title' );
        title.setTextContent( 'File' );
        this.container.add( title );

        const options = new UIPanel();
        options.setClass( 'options' );
        this.container.add( options );

        // New Project / Empty
        let option = new UIRow().setTextContent( 'New' ).setClass( 'option' );
        option.onClick( function () {
            if ( confirm( 'Really want to make a new project?' ) ) {
                editor.clear();
            }
        } );
        options.add( option );
        options.add( new UIHorizontalRule() );

        // Import
        const form = document.createElement( 'form' );
        form.style.display = 'none';
        document.body.appendChild( form );

        const fileInput = document.createElement( 'input' );
        fileInput.multiple = false;
        fileInput.type = 'file';
        fileInput.accetp = '.json';
        fileInput.addEventListener( 'change', async function () {
            const file = fileInput.files[ 0 ];
            if ( file === undefined ) return;

            try {
                const json = JSON.parse( await file.text() );

                editor.clear();
                editor.fromJSON( json );
            } catch ( e ) {
                alert( 'Failed T oOpen Project' );
                console.error( e );
            } finally {
                form.reset();
            }
        } );
        form.appendChild( fileInput );

        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Import Project' );
        option.onClick( function () {

            fileInput.click();

        } );
        options.add( option );

        // Export
        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Export Project' );
        option.onClick( function () {
            let data = editor.toJSON2();
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            });
            let url = window.URL.createObjectURL(blob);

            let a = document.createElement("a");
            a.style = "display: none";
            document.body.appendChild(a);
            a.href = url;
            a.download = editor.scene.name + ".json";
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } );
        options.add( option );
    }
}
