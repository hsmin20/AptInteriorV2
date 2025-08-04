import { Editor } from './Editor.js';
import { Viewport } from './Viewport.js';
import { Sidebar } from './Sidebar.js';
import { Menubar } from './Menubar.js';

const editor = new Editor('Apartment');

const viewport = new Viewport(editor);
document.body.appendChild(viewport.container.dom);

editor.setViewport(viewport);

// viewport.createRenderer();
viewport.render();

const sidebar = new Sidebar( editor, viewport );
document.body.appendChild(sidebar.container.dom);

const menubar = new Menubar( editor );
document.body.appendChild( menubar.container.dom );

function onSuccessStorage() {
    editor.storage.get( async function ( state ) {
        if ( state !== undefined ) {
            await editor.fromJSON( state );
        }

        const selected = editor.selected;
        if ( selected !== undefined ) {
            editor.selectByUuid( selected );
        }

    } );
}

let timeoutID;
export function saveState() {

    clearTimeout( timeoutID );

    timeoutID = setTimeout( function () {

        timeoutID = setTimeout( function () {
            editor.storage.set( editor.toJSON() );

        }, 100 );

    }, 1000 );

}

editor.storage.init(onSuccessStorage);

function onWindowResize() {
    viewport.windowResize();
}

window.addEventListener( 'resize', onWindowResize );
