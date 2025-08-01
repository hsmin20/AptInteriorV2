import { Command } from '../Command.js';

export class SetMaterialMapCommand extends Command {
	constructor( editor, object, mapName, newMap ) {
		super( editor );

		this.type = 'SetMaterialMapCommand';
		this.name = 'SetMaterialMap' + ': ' + mapName;

		this.object = object;

		const material = object.material;

        if(Array.isArray(material)) {
            this.oldMaps = [];
            for(let i=0; i<6; i++)
                this.oldMaps.push(material[i][ mapName] );
            this.newMaps = newMap;
        } else {
            this.oldMap = material[ mapName ];
		    this.newMap = newMap;
        }

		this.mapName = mapName;
	}

	execute() {
        const material = this.object.material;

        if(Array.isArray(material)) {
            for(let i=0; i<6; i++) {
                if (this.oldMaps[i] != this.newMaps[i]) { 
                    if( this.oldMaps[i] !== null && this.oldMaps[i] !== undefined)
                        this.oldMaps[i].dispose();

                    material[ i ][ this.mapName ] = this.newMaps[i];
		            material[ i ].needsUpdate = true;
                }
            }
        } else {
            if ( this.oldMap !== null && this.oldMap !== undefined )
                this.oldMap.dispose();

            material[ this.mapName ] = this.newMap;
            material.needsUpdate = true;
        }

		this.editor.objectChanged(this.object);
	}

	undo() {
        const material = this.object.material;

        if(Array.isArray(material)) {
            for(let i=0; i<6; i++) {
                material[ i ][ this.mapName ] = this.oldMaps[i];
                material[ i ].needsUpdate = true;
            }
        } else {
            material[ this.mapName ] = this.oldMap;
            material.needsUpdate = true;
        }

        this.editor.objectChanged(this.object);
	}
}
