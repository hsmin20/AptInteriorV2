import { Command } from '../Command.js';

export class RemoveObjectCommand extends Command {
	constructor( editor, object ) {
		super( editor );

		this.type = 'RemoveObjectCommand';

		this.object = object;
		this.parent = ( object !== null ) ? object.parent : null;

		if ( this.parent !== null ) {
			this.index = this.parent.children.indexOf( this.object );
		}

		if ( object !== null ) {
			this.name = 'RemoveObject' + ': ' + object.name;
		}
	}

	execute() {
		this.editor.removeObject( this.object );
		this.editor.deselect();
	}

	undo() {
		this.editor.addObject( this.object, this.parent, this.index );
		this.editor.select( this.object );
	}
}
