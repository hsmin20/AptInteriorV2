import { UITabbedPanel, UISpan } from './libs/ui.js';

import { SidebarScene } from './SidebarScene.js';
import { SidebarProperties } from './SidebarProperties.js';

export class Sidebar {

    constructor( editor, viewport ) {

        // const strings = editor.strings;

        editor.setSidebar(this);

        this.container = new UITabbedPanel();
        this.container.setId( 'sidebar' );

        this.sidebarscene = new SidebarScene( editor, viewport );
        this.sidebarProperties = new SidebarProperties( editor );

        const scene = new UISpan().add(
            this.sidebarscene.container,
            this.sidebarProperties.container
        );

        this.container.addTab( 'sceneid', 'Scene', scene );
        this.container.select( 'sceneid' );

        var scope = this;
        const sidebarPropertiesResizeObserver = new ResizeObserver( function () {
        	scope.sidebarProperties.container.tabsDiv.setWidth( getComputedStyle( scope.container.dom ).width );
        } );
        sidebarPropertiesResizeObserver.observe( this.container.tabsDiv.dom );
    }

    refreshUI( obj ) {
        this.sidebarscene.refreshUI();
        this.sidebarProperties.updateUI(obj);
    }

    onObjectSelected(obj) {
        this.sidebarscene.onObjectSelected(obj);
        this.sidebarProperties.toggleTabs(obj);
        this.sidebarProperties.updateUI(obj);
    }
}
