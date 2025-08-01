import { Command } from '../Command.js';

export class MoveObjectCommand extends Command {
	constructor( editor, object = null, newParent = null, newBefore = null ) {
		super( editor );

		this.type = 'MoveObjectCommand';
		this.name = 'MoveObject';

		this.object = object;
		this.oldParent = ( object !== null ) ? object.parent : null;
		this.oldIndex = ( this.oldParent !== null ) ? this.oldParent.children.indexOf( this.object ) : null;
		this.newParent = newParent;

		if ( newBefore !== null ) {
			this.newIndex = ( newParent !== null ) ? newParent.children.indexOf( newBefore ) : null;
		} else {
			this.newIndex = ( newParent !== null ) ? newParent.children.length : null;
		}

		if ( this.oldParent === this.newParent && this.newIndex > this.oldIndex ) {
			this.newIndex --;
		}

		this.newBefore = newBefore;
	}

	execute() {
		this.oldParent.remove( this.object );

		const children = this.newParent.children;
		children.splice( this.newIndex, 0, this.object );
		this.object.parent = this.newParent;

		this.editor.objectChanged( this.object );
		this.editor.objectChanged( this.newParent );
		this.editor.objectChanged( this.oldParent );
	}

	undo() {
		this.newParent.remove( this.object );

		const children = this.oldParent.children;
		children.splice( this.oldIndex, 0, this.object );
		this.object.parent = this.oldParent;

		this.editor.objectChanged( this.object );
		this.editor.objectChanged( this.newParent );
		this.editor.objectChanged( this.oldParent );
	}
}
