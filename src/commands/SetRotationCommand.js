import { Command } from '../Command.js';

export class SetRotationCommand extends Command {
	constructor( editor, object = null, newRotation = null ) {
		super( editor );

		this.type = 'SetRotationCommand';
		this.name = 'SetRotation';
		this.updatable = true;

		this.object = object;
		if ( object !== null && newRotation !== null ) {
			this.oldRotation = object.rotation.clone();
			this.newRotation = newRotation.clone();
		}
	}

	execute() {
		this.object.rotation.copy( this.newRotation );
		this.object.updateMatrixWorld( true );
		this.editor.objectChanged( this.object );
	}

	undo() {
		this.object.rotation.copy( this.oldRotation );
		this.object.updateMatrixWorld( true );
		this.editor.objectChanged( this.object );
	}

	update( command ) {
		this.newRotation.copy( command.newRotation );
	}
}
