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
            leg.position.z = (i < 3) ? -offset_z : offset_z;

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

    addRefrigerator_Internal(editor, parent, name, width, height, depth, doortype, oldPos, oldRot) {
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

        // Add a Body
        const doorDepth = 0.1;
        const bodyDepth = depth - doorDepth;

        const fridgeInsideTexture = textureHelper.get('FridgeInside', 1, 1);
        const shinyTexture = textureHelper.get('Shiny', 1, 2);
        const fridgeBody = new THREE.Mesh( new THREE.BoxGeometry(width, height, bodyDepth), [  
            new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
            new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
            new THREE.MeshStandardMaterial( { map: fridgeInsideTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} )
        ] );
        fridgeBody.name = name + "_Body";
        fridgeBody.position.x = 0.0;
        fridgeBody.position.y = height / 2.0;
        fridgeBody.position.z = 0.0;

        group.children.push( fridgeBody );
		fridgeBody.parent = group;

        // Add doors
        const doorRTexture = textureHelper.get('FridgeDoorR', 1, 1);
        const doorLTexture = textureHelper.get('FridgeDoorL', 1, 1);

        if(doortype == 'topFreezer') {
            const freezerHeight = height / 3.0;
            const freezerDoor = new THREE.Mesh( new THREE.BoxGeometry(width, freezerHeight, doorDepth), [  
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: doorRTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} )
            ] );
            freezerDoor.name = name + "_FreezerDoor";
            freezerDoor.position.x = 0.0;
            freezerDoor.position.y = height - (freezerHeight / 2.0);
            freezerDoor.position.z = (bodyDepth + doorDepth) / 2.0;
            freezerDoor.userData.pivotDir = 'right';
            freezerDoor.userData.openDir = 'outward';

            group.children.push( freezerDoor );
            freezerDoor.parent = group;

            const fridgeHeight = height - freezerHeight;
            const fridgerDoor = new THREE.Mesh( new THREE.BoxGeometry(width, fridgeHeight, doorDepth), [  
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: doorRTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} )
            ] );
            fridgerDoor.name = name + "_FridgerDoor";
            fridgerDoor.position.x = 0.0;
            fridgerDoor.position.y = fridgeHeight / 2.0;
            fridgerDoor.position.z = (bodyDepth + doorDepth) / 2.0;
            fridgerDoor.userData.pivotDir = 'right';
            fridgerDoor.userData.openDir = 'outward';

            group.children.push( fridgerDoor );
            fridgerDoor.parent = group;
        } else if(doortype == 'sideBySide') {
            const halfWidth = width / 2.0;
            const leftDoor = new THREE.Mesh( new THREE.BoxGeometry(halfWidth, height, doorDepth), [  
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: doorLTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} )
            ] );
            leftDoor.name = name + "_LeftDoor";
            leftDoor.position.x = -halfWidth / 2.0;
            leftDoor.position.y = height / 2.0;
            leftDoor.position.z = (bodyDepth + doorDepth) / 2.0;
            leftDoor.userData.pivotDir = 'left';
            leftDoor.userData.openDir = 'outward';

            group.children.push( leftDoor );
            leftDoor.parent = group;

            const rightDoor = new THREE.Mesh( new THREE.BoxGeometry(halfWidth, height, doorDepth), [  
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: doorRTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} )
            ] );
            rightDoor.name = name + "_RightDoor";
            rightDoor.position.x = halfWidth / 2.0;
            rightDoor.position.y = height / 2.0;
            rightDoor.position.z = (bodyDepth + doorDepth) / 2.0;
            rightDoor.userData.pivotDir = 'right';
            rightDoor.userData.openDir = 'outward';

            group.children.push( rightDoor );
            rightDoor.parent = group;

        } else if(doortype == 'fourDoors') {
            const topHeight = height * 3.0 / 5.0;
            const halfWidth = width / 2.0;
            const leftTopDoor = new THREE.Mesh( new THREE.BoxGeometry(halfWidth, topHeight, doorDepth), [  
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: doorLTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} )
            ] );
            leftTopDoor.name = name + "_LeftTopDoor";
            leftTopDoor.position.x = -halfWidth / 2.0;
            leftTopDoor.position.y = height - (topHeight / 2.0);
            leftTopDoor.position.z = (bodyDepth + doorDepth) / 2.0;
            leftTopDoor.userData.pivotDir = 'left';
            leftTopDoor.userData.openDir = 'outward';

            group.children.push( leftTopDoor );
            leftTopDoor.parent = group;

            const bottomHeight = height - topHeight;
            const leftBottomDoor = new THREE.Mesh( new THREE.BoxGeometry(halfWidth, bottomHeight, doorDepth), [  
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: doorLTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} )
            ] );
            leftBottomDoor.name = name + "_LeftBottomDoor";
            leftBottomDoor.position.x = -halfWidth / 2.0;
            leftBottomDoor.position.y = bottomHeight / 2.0;
            leftBottomDoor.position.z = (bodyDepth + doorDepth) / 2.0;
            leftBottomDoor.userData.pivotDir = 'left';
            leftBottomDoor.userData.openDir = 'outward';

            group.children.push( leftBottomDoor );
            leftBottomDoor.parent = group;

            const rightTopDoor = new THREE.Mesh( new THREE.BoxGeometry(halfWidth, topHeight, doorDepth), [  
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: doorRTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} )
            ] );
            rightTopDoor.name = name + "_RightTopDoor";
            rightTopDoor.position.x = halfWidth / 2.0;
            rightTopDoor.position.y = height - (topHeight / 2.0);
            rightTopDoor.position.z = (bodyDepth + doorDepth) / 2.0;
            rightTopDoor.userData.pivotDir = 'right';
            rightTopDoor.userData.openDir = 'outward';

            group.children.push( rightTopDoor );
            rightTopDoor.parent = group;

            const rightBottomDoor = new THREE.Mesh( new THREE.BoxGeometry(halfWidth, bottomHeight, doorDepth), [  
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: shinyTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} ),
                new THREE.MeshStandardMaterial( { map: doorRTexture} ), new THREE.MeshStandardMaterial( { map: shinyTexture} )
            ] );
            rightBottomDoor.name = name + "_RightBottomDoor";
            rightBottomDoor.position.x = halfWidth / 2.0;
            rightBottomDoor.position.y = bottomHeight / 2.0;
            rightBottomDoor.position.z = (bodyDepth + doorDepth) / 2.0;
            rightBottomDoor.userData.pivotDir = 'right';
            rightBottomDoor.userData.openDir = 'outward';

            group.children.push( rightBottomDoor );
            rightBottomDoor.parent = group;
        }

        editor.objectChanged(group);
    }

    addDesk_Internal(editor, parent, name, width, height, depth, desktype, oldPos, oldRot) {
        // Add a group first
        const group = new THREE.Group();
		group.name = name;
        group.userData.isInterior = true;
        group.userData.interiorType = 'Desk';

        if(oldPos != null)
            group.position.copy(oldPos);
        if(oldRot != null)
            group.rotation.copy(oldRot);

        editor.execute( new AddGroupCommand( editor, group, parent ) );

        // Add a Panel
        const deskHeight = 0.05;

        let panelTexture = textureHelper.get(desktype, 1, 1);

        let material = new THREE.MeshStandardMaterial( { map: panelTexture} );
        if(desktype == 'Glass') {
            material.transparent = true;
            material.opacity = 0.8;
        }

        const deskPanel = new THREE.Mesh( new THREE.BoxGeometry(width, deskHeight, depth), material );
        deskPanel.name = name + "_Panel";
        deskPanel.position.x = 0.0;
        deskPanel.position.y = height + (deskHeight / 2.0);
        deskPanel.position.z = 0.0;

        group.children.push( deskPanel );
		deskPanel.parent = group;

        // Add side legs
        const leg_width = 0.05;
        const offset_x = width / 2.0 - (leg_width / 2.0);
 
        const legTexture = textureHelper.get('BlackMetal', 1, 4);
        for(let i=1; i<=2; i++) {
            const leg = new THREE.Mesh( new THREE.BoxGeometry(leg_width, height, depth), new THREE.MeshStandardMaterial( { map: legTexture} ));
            leg.name = name + "_leg" + i;
            leg.position.x = (i % 2 == 0) ? offset_x : -offset_x;
            leg.position.y = height / 2.0;
            leg.position.z = 0.0;

            group.children.push( leg );
            leg.parent = group;
        }

        editor.objectChanged(group);
    }

    addDiningTable_Internal(editor, parent, name, width, height, depth, texturetype, oldPos, oldRot) {
        // Add a group first
        const group = new THREE.Group();
		group.name = name;
        group.userData.isInterior = true;
        group.userData.interiorType = 'DiningTable';

        if(oldPos != null)
            group.position.copy(oldPos);
        if(oldRot != null)
            group.rotation.copy(oldRot);

        editor.execute( new AddGroupCommand( editor, group, parent ) );

        // Add a Panel
        const panelHeight = 0.05;
        let panelTexture = textureHelper.get('Wood', 1, 1);

        const tablePanel = new THREE.Mesh( new THREE.BoxGeometry(width, panelHeight, depth), new THREE.MeshStandardMaterial( { map: panelTexture} ) );
        tablePanel.name = name + "_Panel";
        tablePanel.position.x = 0.0;
        tablePanel.position.y = height + (deskHeight / 2.0);
        tablePanel.position.z = 0.0;

        group.children.push( tablePanel );
		tablePanel.parent = group;

        // Add 4 legs
        const leg_width = 0.05;
        const offset_x = width / 2.0 - (leg_width / 2.0);
        const offset_z = depth / 2.0 - (leg_width / 2.0);

        const legTexture = textureHelper.get('Wood', 1, 4);
        for(let i=1; i<=4; i++) {
            const leg = new THREE.Mesh( new THREE.BoxGeometry(leg_width, height, leg_width), new THREE.MeshStandardMaterial( { map: legTexture} ));
            leg.name = name + "_leg" + i;
            leg.position.x = (i % 2 == 0) ? offset_x : -offset_x;
            leg.position.y = height / 2.0;
            leg.position.z = (i < 3) ? -offset_z : offset_z;

            group.children.push( leg );
            leg.parent = group;
        }

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

    addRefrigerator(editor, modify=false) {
        const _html = `
            <dialog id="refrigeratorTypeDialog">
            <form>
                <p>
                <label>
                    <h1>Add/Change a Refrigerator</h1>
                        <p>Name : <input type="text" id="refrigeratorName" name="refrigeratorName" value="Refrigerator_1"> </p>

                        <h2>Refrigerator size </h2>
                        <p>Width : <input type="text" id="width" name="width" value="0.912">
                           Height : <input type="text" id="height" name="height" value="1.87">
                           Depth : <input type="text" id="depth" name="depth" value="0.93"></p>
                        <div class="clearfix"></div>
                        <h2>Door Type </h2>
                        <p><input type="radio" id="topFreezer" name="doortype" value="topFreezer">Top Freezer
                           <input type="radio" id="sideBySide" name="doortype" value="sideBySide">Side By Side
                           <input type="radio" id="fourDoors" name="doortype" value="fourDoors" checked>4 Doors
                           </p>
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

        const refrigeratorTypeDialog = document.getElementById("refrigeratorTypeDialog");
        const inputNameBox = document.getElementById("refrigeratorName");
        const widthBox = document.getElementById("width");
        const heightBox = document.getElementById("height");
        const depthBox = document.getElementById("depth");

        const confirmBtn = refrigeratorTypeDialog.querySelector("#confirmBtn");

        // "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
        refrigeratorTypeDialog.addEventListener("close", (e) => {
            document.body.removeChild(dialog)
        });

        // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
        confirmBtn.addEventListener("click", (event) => {
            event.preventDefault(); // We don't want to submit this fake form
            
            // refrigeratorTypeDialog.close(); // Have to send the select box value here.
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
            const width = parseFloat(widthBox.value);
            const height = parseFloat(heightBox.value);
            const depth = parseFloat(depthBox.value);
            const doortype = document.querySelector('input[name=doortype]:checked').value;

            document.body.removeChild(dialog)
            
            this.addRefrigerator_Internal(editor, parent, name, width, height, depth, doortype, oldPos, oldRot);
        });

        refrigeratorTypeDialog.showModal();
    }

    addDesk(editor, modify=false) {
        const _html = `
            <dialog id="deskTypeDialog">
            <form>
                <p>
                <label>
                    <h1>Add/Change a Desk</h1>
                        <p>Name : <input type="text" id="deskName" name="deskName" value="Desk_1"> </p>

                        <h2>Desk size </h2>
                        <p>Width : <input type="text" id="width" name="width" value="1.4">
                           Height : <input type="text" id="height" name="height" value="0.8">
                           Depth : <input type="text" id="depth" name="depth" value="0.72"></p>
                        <div class="clearfix"></div>
                        <h2>Desk Type </h2>
                        <p><input type="radio" id="wood" name="desktype" value="Wood" checked>Wood Top
                           <input type="radio" id="glass" name="desktype" value="Glass">Glass Top
                        </p>
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

        const deskTypeDialog = document.getElementById("deskTypeDialog");
        const inputNameBox = document.getElementById("deskName");
        const widthBox = document.getElementById("width");
        const heightBox = document.getElementById("height");
        const depthBox = document.getElementById("depth");

        const confirmBtn = deskTypeDialog.querySelector("#confirmBtn");

        // "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
        deskTypeDialog.addEventListener("close", (e) => {
            document.body.removeChild(dialog)
        });

        // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
        confirmBtn.addEventListener("click", (event) => {
            event.preventDefault(); // We don't want to submit this fake form
            
            // deskTypeDialog.close(); // Have to send the select box value here.
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
            const width = parseFloat(widthBox.value);
            const height = parseFloat(heightBox.value);
            const depth = parseFloat(depthBox.value);
            const desktype = document.querySelector('input[name=desktype]:checked').value;

            document.body.removeChild(dialog)
            
            this.addDesk_Internal(editor, parent, name, width, height, depth, desktype, oldPos, oldRot);
        });

        deskTypeDialog.showModal();
    }

    addBookshelf(editor, modify=false) {
        const _html = `
            <dialog id="bookshelfTypeDialog">
            <form>
                <p>
                <label>
                    <h1>Add/Change a Desk</h1>
                        <p>Name : <input type="text" id="bookshelfName" name="bookshelfName" value="Bookshelf_1"> </p>

                        <h2>Desk size </h2>
                        <p>Width : <input type="text" id="width" name="width" value="1.4">
                           Height : <input type="text" id="height" name="height" value="0.8">
                           Depth : <input type="text" id="depth" name="depth" value="0.72"></p>
                        <div class="clearfix"></div>
                        <h2>Desk Type </h2>
                        <p><input type="radio" id="wood" name="desktype" value="wood" checked>Wood Top
                           <input type="radio" id="glass" name="desktype" value="glass">Glass Top
                        </p>
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

        const deskTypeDialog = document.getElementById("deskTypeDialog");
        const inputNameBox = document.getElementById("deskName");
        const widthBox = document.getElementById("width");
        const heightBox = document.getElementById("height");
        const depthBox = document.getElementById("depth");

        const confirmBtn = deskTypeDialog.querySelector("#confirmBtn");

        // "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
        deskTypeDialog.addEventListener("close", (e) => {
            document.body.removeChild(dialog)
        });

        // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
        confirmBtn.addEventListener("click", (event) => {
            event.preventDefault(); // We don't want to submit this fake form
            
            // deskTypeDialog.close(); // Have to send the select box value here.
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
            const width = parseFloat(widthBox.value);
            const height = parseFloat(heightBox.value);
            const depth = parseFloat(depthBox.value);
            const desktype = document.querySelector('input[name=desktype]:checked').value;

            document.body.removeChild(dialog)
            
            this.addDesk_Internal(editor, parent, name, width, height, depth, desktype, oldPos, oldRot);
        });

        deskTypeDialog.showModal();
    }
    
    addDiningTable(editor, modify=false) {
        const _html = `
            <dialog id="DiningTableTypeDialog">
            <form>
                <p>
                <label>
                    <h1>Add/Change a DiningTable</h1>
                        <p>Name : <input type="text" id="tableName" name="tableName" value="Table_1"> </p>

                    <h2>Table Size (m)</h2>
                    <p>
                        <label for="tableWidth">Width: </label>
                        <input type="number" id="tableWidth" name="tableWidth" min="0.1" step="0.1" value="1.6">
                        
                        <label for="tableDepth" style="margin-left: 10px;">Depth: </label>
                        <input type="number" id="tableDepth" name="tableDepth" min="0.1" step="0.1" value="0.9">
                        
                        <label for="tableHeight" style="margin-left: 10px;">Height: </label>
                        <input type="number" id="tableHeight" name="tableHeight" min="0.1" step="0.05" value="0.75">
                    </p>
                    <div class="clearfix"></div>
                        <h2>Texture Type </h2>
                        <p><input type="radio" id="wood" name="texturetype" value="wood" checked>wood
                           <input type="radio" id="marbel" name="texturetype" value="marvel">marbel</p>
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

                const bedTypeDialog = document.getElementById("diningtableTypeDialog");
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
                    const width = parseFloat(tableWidth.value);
                    const height = parseFloat(tableDepth.value);
                    const depth = parseFloat(tableHeight.value);
                    const texturetype = document.querySelector('input[name=texturetype]:checked').value;

                    document.body.removeChild(dialog)
                    
                    this.addDiningTable_Internal(editor, parent, name, width, height, depth, texturetype, oldPos, oldRot)
                });

                bedTypeDialog.showModal();
            }




        }
            

export let roomInterior = new RoomInterior();