import * as THREE from 'three';
import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

export class MenubarTools {
    constructor( editor ) {
        this.container = new UIPanel();
        this.container.setClass( 'menu' );

        const title = new UIPanel();
        title.setClass( 'title' );
        title.setTextContent( 'Tools' );
        this.container.add( title );

        const options = new UIPanel();
        options.setClass( 'options' );
        this.container.add( options );

        // Upload
        let option = new UIRow().setTextContent( 'Upload to DB' ).setClass( 'option' );
        option.onClick( async () => {
           let data = editor.toJSON2();

            try {
                const response = await fetch('./upload_model.php?tblname=ModelHouse&userid=hsmin', {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                } );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                alert('Done uploading');
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error uploading data to Database');
            }
        } );
        options.add( option );

        // Download
        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Download from DB' );
        option.onClick( async () => {
            try {
                const response = await fetch('./download_model.php?tblname=ModelHouse&userid=hsmin');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                editor.clear();
                editor.fromJSON( data );

                alert('Done downloading');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } );
        options.add( option );

        options.add( new UIHorizontalRule() );

        // Player
        option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'Go to Player' );
        option.onClick( () => {
            window.location.href = './player.html';
        } );
        options.add( option );
    }
}
