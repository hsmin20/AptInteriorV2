import { Command } from '../Command.js';

export class SetMaterialOpaqueCommand extends Command {
	constructor( editor, object, opaque ) {
		super( editor );

		this.type = 'SetMaterialOpaqueCommand';
		this.name = 'SetMaterialOpaque';

		this.object = object;
        this.opaque = opaque;
	}

    makeOpaque() {
        const material = this.object.material;

        if(Array.isArray(material)) {
            // BoxGeometry
            for(let i=0; i<6; i++) {
                material[i].transparent = this.opaque[i];
                if(this.opaque[i])
                    material[i].opacity = 0.8;
                material[i].needsUpdate = true;
            }
        } else {
            material.transparent = true;
            material.opacity = 0.8;
            material.needsUpdate = true;
        }
    }

    makeNonOpaque() {
        const material = this.object.material;

        if(Array.isArray(material)) { // BoxGeometry
            // BoxGeometry
            for(let i=0; i<6; i++) {
                material[i].transparent = this.opaque[i];
                if(this.opaque[i])
                    material[i].opacity = 0.8;
                material[i].needsUpdate = true;
            }
        } else {
            material.transparent = false;
            material.opacity = 1.0;
            material.needsUpdate = true;
        }
    }

	execute() {
        if(this.opaque)
            this.makeOpaque();
        else
            this.makeNonOpaque();

		this.editor.objectChanged(this.object);
	}

	undo() {
        if(this.opaque)
            this.makeNonOpaque();
        else
            this.makeOpaque();

        this.editor.objectChanged(this.object);
	}
}
