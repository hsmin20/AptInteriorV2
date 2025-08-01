import { Command } from '../Command.js';

export class SetPositionCommand extends Command {
	constructor( editor, object = null, newPosition = null, optionalOldPosition = null ) {
		super( editor );

		this.type = 'SetPositionCommand';
		this.name = 'SetPosition';
		this.updatable = true;

		this.object = object;

		if ( object !== null && newPosition !== null ) {
			this.oldPosition = object.position.clone();
			this.newPosition = newPosition.clone();
		}

		if ( optionalOldPosition !== null ) {
			this.oldPosition = optionalOldPosition.clone();
		}
	}

	execute() {
		this.object.position.copy( this.newPosition );
		this.object.updateMatrixWorld( true );
		this.editor.objectChanged( this.object );
	}

	undo() {
		this.object.position.copy( this.oldPosition );
		this.object.updateMatrixWorld( true );
		this.editor.objectChanged( this.object );
	}

	update( command ) {
		this.newPosition.copy( command.newPosition );
	}
}
