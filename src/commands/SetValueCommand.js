import { Command } from '../Command.js';

export class SetValueCommand extends Command {
	constructor( editor, object = null, attributeName = '', newValue = null ) {
		super( editor );

        this.type = 'SetValueCommand';
		this.name = 'SetValue' + ': ' + attributeName;
		this.updatable = true;

		this.object = object;
		this.attributeName = attributeName;
		this.oldValue = ( object !== null ) ? object[ attributeName ] : null;
		this.newValue = newValue;
	}

	execute() {
		this.object[ this.attributeName ] = this.newValue;
		this.editor.objectChanged( this.object );
	}

	undo() {
		this.object[ this.attributeName ] = this.oldValue;
		this.editor.objectChanged( this.object );
	}

	update( cmd ) {
		this.newValue = cmd.newValue;
	}
}
