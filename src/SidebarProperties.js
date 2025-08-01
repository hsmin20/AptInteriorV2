import { UITabbedPanel } from './libs/ui.js';

import { SidebarObject } from './SidebarObject.js';
// import { SidebarGeometry } from './SidebarGeometry.js';

export class SidebarProperties {
    constructor( editor ) {
        this.container = new UITabbedPanel();
        this.container.setId( 'properties' );

        this.sidebarObject = new SidebarObject( editor );
        // this.sidebarGeometry = new SidebarGeometry( editor );
        this.container.addTab( 'objectTab', 'Object', this.sidebarObject.container);
        // this.container.addTab( 'geometryTab', 'Geometry',  this.sidebarGeometry.container);
        this.container.select( 'objectTab' );

        // this.geometryTab = this.getTabByTabId( this.container.tabs, 'geometryTab' );

	    this.toggleTabs( editor.selected );
    }

	getTabByTabId( tabs, tabId ) {
		return tabs.find( function ( tab ) {
			return tab.dom.id === tabId;
		} );
	}

	toggleTabs( object ) {
		this.container.setHidden( object === null || (object.userData.isInterior != true));

		if ( object === null ) return;

		// this.geometryTab.setHidden( ! object.geometry );

		// set active tab
		if ( this.container.selected === 'geometryTab' ) {
			this.container.select( this.geometryTab.isHidden() ? 'objectTab' : 'geometryTab' );
		}
	}

    updateUI( object ) {
        if (object != null) {
            this.sidebarObject.updateUI(object);
            // this.sidebarGeometry.updateUI();
        }
    }
}
