// import * as Commands from './commands/Commands.js';

export class History {
	constructor( editor ) {
		this.editor = editor;
		this.undos = [];
		this.redos = [];
		this.lastCmdTime = Date.now();
		this.idCounter = 0;

		this.historyDisabled = false;
		this.config = editor.config;
	}

	execute( cmd, optionalName ) {
		const lastCmd = this.undos[ this.undos.length - 1 ];
		const timeDifference = Date.now() - this.lastCmdTime;

		const isUpdatableCmd = lastCmd &&
			lastCmd.updatable &&
			cmd.updatable &&
			lastCmd.object === cmd.object &&
			lastCmd.type === cmd.type &&
			lastCmd.script === cmd.script &&
			lastCmd.attributeName === cmd.attributeName;

		if ( isUpdatableCmd && cmd.type === 'SetScriptValueCommand' ) {
			// When the cmd.type is "SetScriptValueCommand" the timeDifference is ignored
			lastCmd.update( cmd );
			cmd = lastCmd;
		} else if ( isUpdatableCmd && timeDifference < 500 ) {
			lastCmd.update( cmd );
			cmd = lastCmd;
		} else {
			// the command is not updatable and is added as a new part of the history
			this.undos.push( cmd );
			cmd.id = ++ this.idCounter;
		}

		cmd.name = ( optionalName !== undefined ) ? optionalName : cmd.name;
		cmd.execute();
		cmd.inMemory = true;

		this.lastCmdTime = Date.now();

		// clearing all the redo-commands
		this.redos = [];
	}

	undo() {
		if ( this.historyDisabled ) {
			alert( 'forbid' );
			return;
		}

		let cmd = undefined;
		if ( this.undos.length > 0 ) {
			cmd = this.undos.pop();
			if ( cmd.inMemory === false ) {
				cmd.fromJSON( cmd.json );
			}
		}

		if ( cmd !== undefined ) {
			cmd.undo();
			this.redos.push( cmd );
		}
		return cmd;
	}

	redo() {
		if ( this.historyDisabled ) {
			alert( 'forbid' );
			return;
		}

		let cmd = undefined;
		if ( this.redos.length > 0 ) {
			cmd = this.redos.pop();
			if ( cmd.inMemory === false ) {
				cmd.fromJSON( cmd.json );
			}
		}

		if ( cmd !== undefined ) {
			cmd.execute();
			this.undos.push( cmd );
		}

    	return cmd;
	}

	clear() {
		this.undos = [];
		this.redos = [];
		this.idCounter = 0;
	}

	goToState( id ) {
		if ( this.historyDisabled ) {
			alert( 'forbid' );
			return;
		}

		let cmd = this.undos.length > 0 ? this.undos[ this.undos.length - 1 ] : undefined;	// next cmd to pop
		if ( cmd === undefined || id > cmd.id ) {
			cmd = this.redo();
			while ( cmd !== undefined && id > cmd.id ) {
				cmd = this.redo();
			}
		} else {
			while ( true ) {
				cmd = this.undos[ this.undos.length - 1 ];	// next cmd to pop
				if ( cmd === undefined || id === cmd.id ) break;

    			this.undo();
			}
		}

		// this.editor.signals.sceneGraphChanged.dispatch();
	}
}
