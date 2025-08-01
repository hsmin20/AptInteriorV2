import { Command } from '../Command.js';

export class SetGeometryCommand extends Command {
	constructor( editor, object, newGeometry ) {
		super( editor );

		this.type = 'SetGeometryCommand';
		this.name = 'SetGeometry';
		this.updatable = true;

		this.object = object;
		this.oldGeometry = ( object !== null ) ? object.geometry : null;
		this.newGeometry = newGeometry;
	}

	execute() {
		this.object.geometry.dispose();
		this.object.geometry = this.newGeometry;
		this.object.geometry.computeBoundingSphere();

		this.editor.objectChanged( this.object );
	}

	undo() {
		this.object.geometry.dispose();
		this.object.geometry = this.oldGeometry;
		this.object.geometry.computeBoundingSphere();

		this.editor.objectChanged( this.object );
	}
}
