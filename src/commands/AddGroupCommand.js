import { Command } from '../Command.js';

export class AddGroupCommand extends Command {
	constructor( editor, object, parent = null ) {
		super( editor );
		this.type = 'AddGroupCommand';

		this.object = object;
        this.parent = parent;
		this.name = 'AddGroup' + ': ' + object.name;
	}

	execute() {
		this.editor.addObject( this.object, this.parent );
		this.editor.select( this.object );
	}

	undo() {
		this.editor.removeObject( this.object );
		this.editor.deselect();
	}
}
