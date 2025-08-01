
let database = null;

export class Storage {
    constructor() {
	    this.indexedDB = window.indexedDB;
        if ( this.indexedDB === undefined ) {
            console.warn( 'Storage: IndexedDB not available.' );
        }

	    this.name = 'apt_interior';
        this.version = 1;   
    }

    init(onSuccessFunc) {
        const request = this.indexedDB.open( this.name, this.version );
        request.onupgradeneeded = function ( event ) {
            const db = event.target.result;
            if ( db.objectStoreNames.contains( 'states' ) === false ) {
                db.createObjectStore( 'states' );
            }
        };

        request.onsuccess = function ( event ) {
            database = event.target.result;
            onSuccessFunc();
        };

        request.onerror = function ( event ) {
            console.error( 'IndexedDB', event );
        };
    }

    get( callback ) {
        const transaction = database.transaction( [ 'states' ], 'readonly' );
        const objectStore = transaction.objectStore( 'states' );
        const request = objectStore.get( 0 );

        request.onsuccess = function ( event ) {
            callback( event.target.result );
        };
    }

    set( data ) {
        const start = performance.now();

        const transaction = database.transaction( [ 'states' ], 'readwrite' );
        const objectStore = transaction.objectStore( 'states' );
        const request = objectStore.put( data, 0 );

        request.onsuccess = function () {
            console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved state to IndexedDB. ' + ( performance.now() - start ).toFixed( 2 ) + 'ms' );
        };
    }

    clear() {
        const transaction = database.transaction( [ 'states' ], 'readwrite' );
        const objectStore = transaction.objectStore( 'states' );
        const request = objectStore.clear();

        request.onsuccess = function () {
            console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Cleared IndexedDB.' );
        };
    }
}
