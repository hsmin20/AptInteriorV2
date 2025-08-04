import * as THREE from 'three';

import { AddGroupCommand } from './commands/AddGroupCommand.js';
import { RemoveObjectCommand } from './commands/RemoveObjectCommand.js';
import { SetMaterialMapCommand } from './commands/SetMaterialMapCommand.js';

import { textureHelper } from './TextureHelper.js';

export class RoomInterior {
    addTV_Internal(editor, parent, name, tvsize, tvtype, oldPos, oldRot) {
         // Add a group first
        const group = new THREE.Group();
		group.name = name;
        group.userData.isInterior = true;
        group.userData.interiorType = 'TV';
        group.position.y = 1.0;

        if(oldPos != null)
            group.position.copy(oldPos);
        if(oldRot != null)
            group.rotation.copy(oldRot);

        editor.execute( new AddGroupCommand( editor, group, parent ) );

        const depth = 0.02;
        // Add a box (16:9 size)
        const inchToMeter = 0.0254;
        const theta = Math.atan(9 / 16);
        const width = tvsize * inchToMeter * Math.cos(theta);
        const height = tvsize * inchToMeter * Math.sin(theta);

        const tvTexture = textureHelper.get('TV', 1, 1);
        const backTexture = textureHelper.get('BlackMetal', 5, 4);
        const sideTexture = textureHelper.get('BlackMetal', 1, 4);

        const tvFrame = new THREE.Mesh( new THREE.BoxGeometry(width, height, depth), [  
            new THREE.MeshStandardMaterial( { map: sideTexture} ), new THREE.MeshStandardMaterial( { map: sideTexture} ),
            new THREE.MeshStandardMaterial( { map: sideTexture} ), new THREE.MeshStandardMaterial( { map: sideTexture} ),
            new THREE.MeshStandardMaterial( { map: tvTexture} ), new THREE.MeshStandardMaterial( { map: backTexture} )
        ] );
        tvFrame.name = name + "_Frame";
        tvFrame.position.x = 0.0;
        tvFrame.position.y = 0.0;
        tvFrame.position.z = 0.0;

        group.children.push( tvFrame );
		tvFrame.parent = group;

        if(tvtype == 'stand') {
            //  add 4 legs
            const radius = 0.01;
            const length = 0.1;
            const offset_x = 0.1;
            const offset_y = (length / 2) * Math.sin(Math.PI / 4.0);
            for(let i=1; i<=4; i++) {
                const leg = new THREE.Mesh( new THREE.CylinderGeometry(radius, radius, length), new THREE.MeshStandardMaterial( { map: sideTexture} ));
                leg.name = name + "_leg" + i;
                leg.position.x = i < 3 ? width / 2.0 - offset_x : -(width / 2.0 - offset_x);
                leg.position.y = -(height / 2.0 + offset_y);
                leg.position.z = (i % 2 == 0) ? -offset_y : offset_y;
                leg.rotation.x = (i % 2 == 0) ? Math.PI / 4.0 : -(Math.PI / 4.0);

                group.children.push( leg );
                leg.parent = group;
            }
        }

        editor.objectChanged(group);
    }

    addBed_Internal(editor, parent, name, bedsize, bedtype, oldPos, oldRot) {
         // Add a group first
        const group = new THREE.Group();
		group.name = name;
        group.userData.isInterior = true;
        group.userData.interiorType = 'Bed';

        if(oldPos != null)
            group.position.copy(oldPos);
        if(oldRot != null)
            group.rotation.copy(oldRot);

        editor.execute( new AddGroupCommand( editor, group, parent ) );

        const depth = 2.0; // 2m
        let width = 1.1; // single
        if(bedsize == 'supersingle')
            width = 1.1;
        else if(bedsize == 'double')
            width = 1.4;
        else if(bedsize == 'queen')
            width = 1.5;
        else if(bedsize == 'king')
            width = 1.6;
        else if(bedsize == 'largeking')
            width = 1.8;

        let frameTexture = null;
        if(bedtype == 'metal')
            frameTexture = textureHelper.get('BlackMetal', 4, 4);
        else
            frameTexture = textureHelper.get('Wood', 4, 4);

        // add a frame
        const frameheight = 0.2;
        const bedFrame = new THREE.Mesh( new THREE.BoxGeometry(width, frameheight, depth),
            new THREE.MeshStandardMaterial( { map: frameTexture} ) );
        bedFrame.name = name + "_Frame";
        bedFrame.position.x = 0.0;
        bedFrame.position.y = frameheight / 2.0;
        bedFrame.position.z = 0.0;

        group.children.push( bedFrame );
		bedFrame.parent = group;

        // add a head
        const headheight = 0.8;
        const headdepth = 0.05;
        const bedHead = new THREE.Mesh( new THREE.BoxGeometry(width, headheight, headdepth),
            new THREE.MeshStandardMaterial( { map: frameTexture} ) );
        bedHead.name = name + "_Head";
        bedHead.position.x = 0.0;
        bedHead.position.y = headheight / 2.0;
        bedHead.position.z = (depth + headdepth) / 2.0 ;

        group.children.push( bedHead );
		bedHead.parent = group;

        //  add 4 legs
        const radius = 0.02;
        const leg_length = 0.2;

        const offset_x = width / 2.0 - radius;
        const offset_z = depth / 2.0 - radius;

        for(let i=1; i<=4; i++) {
            const leg = new THREE.Mesh( new THREE.CylinderGeometry(radius, radius, leg_length), new THREE.MeshStandardMaterial( { map: frameTexture} ));
            leg.name = name + "_leg" + i;
            leg.position.x = (i % 2 == 0) ? offset_x : -offset_x;
            leg.position.y = -leg_length / 2.0;
            leg.position.z = (i % 2 == 0) ? -offset_z : offset_z;

            group.children.push( leg );
            leg.parent = group;
        }

        // add a mattress
        const mattressTexture = textureHelper.get('Mattress', 2, 4);

        const mattressheight = 0.2;
        const mattress = new THREE.Mesh( new THREE.BoxGeometry(width, mattressheight, depth),
            new THREE.MeshStandardMaterial( { map: mattressTexture} ) );
        mattress.name = name + "_mattress";
        mattress.position.x = 0.0;
        mattress.position.y = frameheight + mattressheight / 2.0;
        mattress.position.z = 0.0;

        group.children.push( mattress );
		mattress.parent = group;

        group.position.y = leg_length;

        editor.objectChanged(group);
    }

    addWall_Internal(editor, walltype, whichside) {
        let object = editor.selected;
        let materials = object.material;

        let index = 4;
        if(whichside == 'outside') {
            index = 5;
        }

        let newMaps = [];
        for(let i=0; i<6; i++) {
            if(i != index) {
                newMaps.push(materials[i]['map'] );
            } else {
                const repeatX = materials[i]['map'].repeat.x;
                const repeatY = materials[i]['map'].repeat.y;

                const texture = textureHelper.get(walltype, repeatX, repeatY);
                if ( texture !== null ) {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    materials.needsUpdate = true;
                }

                materials[index].dispose();
                newMaps.push(texture);
            }
        }

        editor.execute( new SetMaterialMapCommand( editor, object, 'map', newMaps ) );
        
        editor.objectChanged( object );
    }

    addWall(editor) {
        const _html = `
            <dialog id="wallTypeDialog">
            <form>
                <p>
                <label>
                    <h2>Wallpaper Type</h2>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/wallpaper1.jpg" alt="wallpaper1" width="60" height="40">
                        <input type="radio" name="walltype" id="wallpaper1" value="Wallpaper1" checked/>Type 1
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/pointwall.jpg" alt="pointwall" width="60" height="40">
                        <input type="radio" name="walltype" id="pointwall" value="PointWall"/>Type 2
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/pointwall2.jpg" alt="pointwall2" width="60" height="40">
                        <input type="radio" name="walltype" id="pointwall2" value="PointWall2"/>Type 3
                    </div>
                    </div>
                </label>
                </p>
                <div class="clearfix"></div>
                <p>
                <label>
                    <h2>Which side</h2>
                    <div class="responsive">
                    <div class="gallery">
                        <input type="radio" name="whichside" id="inside" value="inside" checked/>inside
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <input type="radio" name="whichside" id="outside" value="outside"/>outside
                    </div>
                    </div>
                </label>
                <div class="clearfix"></div>
                <div>
                <p>
                <button value="cancel" formmethod="dialog">Cancel</button>
                <button id="confirmBtn" value="default">Apply</button>
                </p>
                </div>
            </form>
    `

        const dom = new DOMParser().parseFromString(_html, 'text/html');
        const dialog = dom.querySelector("dialog");
        document.body.appendChild(dialog)

        const wallTypeDialog = document.getElementById("wallTypeDialog");

        const confirmBtn = wallTypeDialog.querySelector("#confirmBtn");

        // "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
        wallTypeDialog.addEventListener("close", (e) => {
            document.body.removeChild(dialog)
        });

        // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
        confirmBtn.addEventListener("click", (event) => {
            event.preventDefault(); // We don't want to submit this fake form
            
            // wallTypeDialog.close(); // Have to send the select box value here.
            const walltype = document.querySelector('input[name=walltype]:checked').value;
            const whichside = document.querySelector('input[name=whichside]:checked').value;

            document.body.removeChild(dialog)
            
            this.addWall_Internal(editor, walltype, whichside);
        });

        wallTypeDialog.showModal();
    }

    addTV(editor, modify=false) {
        const _html = `
            <dialog id="tvTypeDialog">
            <form>
                <p>
                <label>
                    <h1>Add/Change a TV</h1>
                        <p>Name : <input type="text" id="tvName" name="tvName" value="TV_1"> </p>

                        <h2>TV size </h2>
                        <p><input type="radio" id="40inch" name="tvsize" value="40">40"
                           <input type="radio" id="50inch" name="tvsize" value="50">50"
                           <input type="radio" id="55inch" name="tvsize" value="55">55"
                           <input type="radio" id="60inch" name="tvsize" value="60">60"
                           <input type="radio" id="65inch" name="tvsize" value="65">65"
                           <input type="radio" id="70inch" name="tvsize" value="70" checked>70"
                           <input type="radio" id="75inch" name="tvsize" value="75">75"
                           <input type="radio" id="85inch" name="tvsize" value="85">85"</p>
                        <div class="clearfix"></div>
                        <h2>Stand Type </h2>
                        <p><input type="radio" id="wall" name="tvtype" value="wall">wall
                           <input type="radio" id="stand" name="tvtype" value="stand" checked>stand</p>
                </label>
                </p>
                <div>
                <p>
                <button value="cancel" formmethod="dialog">Cancel</button>
                <button id="confirmBtn" value="default">Apply</button>
                </p>
                </div>
            </form>
    `

        const dom = new DOMParser().parseFromString(_html, 'text/html');
        const dialog = dom.querySelector("dialog");
        document.body.appendChild(dialog)

        const tvTypeDialog = document.getElementById("tvTypeDialog");
        const inputNameBox = document.getElementById("tvName");

        const confirmBtn = tvTypeDialog.querySelector("#confirmBtn");

        // "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
        tvTypeDialog.addEventListener("close", (e) => {
            document.body.removeChild(dialog)
        });

        // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
        confirmBtn.addEventListener("click", (event) => {
            event.preventDefault(); // We don't want to submit this fake form
            
            // tvTypeDialog.close(); // Have to send the select box value here.
            var parent = editor.selected;
            var oldPos = null;
            var oldRot = null;
            if(modify) {
                parent = editor.selected.parent;
                oldPos = editor.selected.position;
                oldRot = editor.selected.rotation;

                editor.execute( new RemoveObjectCommand( editor, editor.selected ) );
            }

            var name = inputNameBox.value;
            const tvsize = parseInt(document.querySelector('input[name=tvsize]:checked').value);
            const tvtype = document.querySelector('input[name=tvtype]:checked').value;

            document.body.removeChild(dialog)
            
            this.addTV_Internal(editor, parent, name, tvsize, tvtype, oldPos, oldRot);
        });

        tvTypeDialog.showModal();
    }

    addBed(editor, modify=false) {
        const _html = `
            <dialog id="bedTypeDialog">
            <form>
                <p>
                <label>
                    <h1>Add/Change a Bed</h1>
                        <p>Name : <input type="text" id="bedName" name="bedName" value="Bed_1"> </p>

                        <h2>Bed size </h2>
                        <p><input type="radio" id="single" name="bedsize" value="single">Single
                           <input type="radio" id="supersingle" name="bedsize" value="supersingle">Super Single
                           <input type="radio" id="double" name="bedsize" value="double">Double
                           <input type="radio" id="queen" name="bedsize" value="queen" checked>Queen
                           <input type="radio" id="king" name="bedsize" value="king">King
                           <input type="radio" id="largeking" name="bedsize" value="largeking">Large King</p>
                        <div class="clearfix"></div>
                        <h2>Frame Type </h2>
                        <p><input type="radio" id="wood" name="frametype" value="wood" checked>wood
                           <input type="radio" id="metal" name="frametype" value="metal">metal</p>
                </label>
                </p>
                <div>
                <p>
                <button value="cancel" formmethod="dialog">Cancel</button>
                <button id="confirmBtn" value="default">Apply</button>
                </p>
                </div>
            </form>
    `

        const dom = new DOMParser().parseFromString(_html, 'text/html');
        const dialog = dom.querySelector("dialog");
        document.body.appendChild(dialog)

        const bedTypeDialog = document.getElementById("bedTypeDialog");
        const inputNameBox = document.getElementById("bedName");

        const confirmBtn = bedTypeDialog.querySelector("#confirmBtn");

        // "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
        bedTypeDialog.addEventListener("close", (e) => {
            document.body.removeChild(dialog)
        });

        // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
        confirmBtn.addEventListener("click", (event) => {
            event.preventDefault(); // We don't want to submit this fake form
            
            // bedTypeDialog.close(); // Have to send the select box value here.
            var parent = editor.selected;
            var oldPos = null;
            var oldRot = null;
            if(modify) {
                parent = editor.selected.parent;
                oldPos = editor.selected.position;
                oldRot = editor.selected.rotation;

                editor.execute( new RemoveObjectCommand( editor, editor.selected ) );
            }

            var name = inputNameBox.value;
            const bedsize = document.querySelector('input[name=bedsize]:checked').value;
            const frametype = document.querySelector('input[name=frametype]:checked').value;

            document.body.removeChild(dialog)
            
            this.addBed_Internal(editor, parent, name, bedsize, frametype, oldPos, oldRot);
        });

        bedTypeDialog.showModal();
    }
}

export let roomInterior = new RoomInterior();