import { Command } from '../Command.js';

export class SetMaterialCommand extends Command {
	constructor( editor, object = null, newMaterial = null, materialSlot = - 1 ) {

		super( editor );

		this.type = 'SetMaterialCommand';
		this.name = 'SetMaterial';

		this.object = object;
		this.materialSlot = materialSlot;

		this.oldMaterial = ( object !== null ) ? object.material : null;
		this.newMaterial = newMaterial;

	}

	execute() {
		this.object.material = this.newMaterial;
        this.editor.objectChanged(this.object);
	}

	undo() {
		this.object.material = this.oldMaterial;
        this.editor.objectChanged(this.object);
	}
}
