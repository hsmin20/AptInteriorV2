import { Command } from '../Command.js';

export class AddObjectCommand extends Command {
	constructor( editor, object, parent ) {
		super( editor );
		this.type = 'AddObjectCommand';

		this.object = object;
        this.parent = parent;
		this.name = 'AddObject' + ': ' + object.name;
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
