import { UIPanel, UIRow } from './libs/ui.js';

export class MenubarHelp {
    constructor( editor ) {
        this.container = new UIPanel();
        this.container.setClass( 'menu' );

        const title = new UIPanel();
        title.setClass( 'title' );
        title.setTextContent( 'Help' );
        this.container.add( title );

        const options = new UIPanel();
        options.setClass( 'options' );
        this.container.add( options );

        // About
        let option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'About' );
        option.onClick( function () {
            window.open( 'https://threejs.org', '_blank' );
        } );
        options.add( option );
    }
}
