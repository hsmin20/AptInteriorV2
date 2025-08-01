import { textureHelper } from '../TextureHelper.js';

export function showTextureImages( cbSetTexture ) {
    const _html = `
        <dialog id="textureImageDialog">
            <form>
                <p>
                <label>
                    <h2>Add a Texture image</h2>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/wallpaper1.jpg" alt="wallpaper1" width="60" height="40">
                        <input type="radio" name="texture" id="wallpaper1" value="Wallpaper1" checked/>Wall Paper
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/pointwall.jpg" alt="pointwall" width="60" height="40">
                        <input type="radio" name="texture" id="pointwall" value="PointWall"/>Point Wall
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/ceiling.jpg" alt="Ceiling" width="60" height="40">
                        <input type="radio" name="texture" id="Ceiling" value="Ceiling"/>Ceiling
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/floor.jpg" alt="floor" width="60" height="40">
                        <input type="radio" name="texture" id="floor" value="Floor"/>Floor
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/roomfloor.jpg" alt="roomfloor" width="60" height="40">
                        <input type="radio" name="texture" id="roomfloor" value="RoomFloor"/>Room Floor
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/tile.jpg" alt="tile" width="60" height="40">
                        <input type="radio" name="texture" id="tile" value="Tile"/>Tile
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/kitchentile1.jpg" alt="kitchentile1" width="60" height="40">
                        <input type="radio" name="texture" id="kitchentile1" value="KitchenTile"/>Kitchen Tile
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/wood.jpg" alt="wood" width="60" height="40">
                        <input type="radio" name="texture" id="wood" value="Wood"/>Wood
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/concrete.jpg" alt="concrete" width="60" height="40">
                        <input type="radio" name="texture" id="concrete" value="Concrete"/>Concrete
                    </div>
                    </div>

                    <div class="clearfix"></div>
                    
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/window.jpg" alt="window" width="60" height="40">
                        <input type="radio" name="texture" id="window" value="Window"/>Window
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/internalWindow.jpg" alt="internalWindow" width="60" height="40">
                        <input type="radio" name="texture" id="internalWindow" value="InternalWindow"/>Internal Window
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/swindow.jpg" alt="swindow" width="60" height="40">
                        <input type="radio" name="texture" id="swindow" value="SmallWindow"/>Small Window
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/doorL.jpg" alt="doorL" width="60" height="40">
                        <input type="radio" name="texture" id="doorL" value="DoorLeft"/>Door (Left Handle)
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/doorR.jpg" alt="doorR" width="60" height="40">
                        <input type="radio" name="texture" id="doorR" value="DoorRight"/>Door (Right Handle)
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/frontdoorL.jpg" alt="frontdoorL" width="60" height="40">
                        <input type="radio" name="texture" id="frontdoorL" value="FrontDoorLeft"/>Front Door (Left Handle)
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/frontdoorR.jpg" alt="frontdoorR" width="60" height="40">
                        <input type="radio" name="texture" id="frontdoorR" value="FrontDoorRight"/>Front Door (Right Handle)
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/glassDoorL.jpg" alt="glassDoorL" width="60" height="40">
                        <input type="radio" name="texture" id="glassDoorL" value="GlassDoorLeft"/>Glass Door (Left Handle)
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/glassDoorR.jpg" alt="glassDoorR" width="60" height="40">
                        <input type="radio" name="texture" id="glassDoorR" value="GlassDoorRight"/>Glass Door (Right Handle)
                    </div>
                    </div>

                    <div class="clearfix"></div>
                    
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/whitePlastic.jpg" alt="whitePlastic" width="60" height="40">
                        <input type="radio" name="texture" id="whitePlastic" value="WhitePlastic"/>White Plastic
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/pinkPlastic.jpg" alt="pinkPlastic" width="60" height="40">
                        <input type="radio" name="texture" id="pinkPlastic" value="PinkPlastic"/>Pink Plastic
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/balconytile.jpg" alt="balconyTile" width="60" height="40">
                        <input type="radio" name="texture" id="balconyTile" value="BalconyTile"/>Balcony Tile
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/kitchenSink.jpg" alt="kitchenSink" width="60" height="40">
                        <input type="radio" name="texture" id="kitchenSink" value="KitchenSink"/>Kitchen Sink
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/marble.jpg" alt="marble" width="60" height="40">
                        <input type="radio" name="texture" id="marble" value="Marble"/>Marble
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/drawerDoorL.jpg" alt="drawerDoorL" width="60" height="40">
                        <input type="radio" name="texture" id="drawerDoorL" value="DrawerDoorLeft"/>Drawer Door Left
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/drawerDoorR.jpg" alt="drawerDoorR" width="60" height="40">
                        <input type="radio" name="texture" id="drawerDoorR" value="DrawerDoorRight"/>Drawer Door Right
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/gasRange.jpg" alt="gasRange" width="60" height="40">
                        <input type="radio" name="texture" id="gasRange" value="GasRange"/>Gas Range
                    </div>
                    </div>
                    <div class="responsive">
                    <div class="gallery">
                        <img src="./textures/blackmetal.jpg" alt="blackmetal" width="60" height="40">
                        <input type="radio" name="texture" id="blackmetal" value="BlackMetal"/>Black Metal
                    </div>
                    </div>

                </label>
                </p>
                <div class="clearfix"></div>
                <div style="padding:6px;">
                <p>
                Repeat <input type="text" id="repeatx" name="repeatx" value="1" size="3"> x <input type="text" id="repeaty" name="repeaty" value="1" size="3">
                <button value="cancel" formmethod="dialog">Cancel</button>
                <button id="confirmBtn" value="default">Apply</button>
                </p>
                </div>
            </form>
        </dialog>
`

    const dom = new DOMParser().parseFromString(_html, 'text/html');
    const dialog = dom.querySelector("dialog");
    document.body.appendChild(dialog)

    const textureImageDialog = document.getElementById("textureImageDialog");
    const confirmBtn = textureImageDialog.querySelector("#confirmBtn");

    // let editorscope = editor;

    // "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
    textureImageDialog.addEventListener("close", (e) => {
        document.body.removeChild(dialog)
    });

    // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
    confirmBtn.addEventListener("click", (event) => {
        event.preventDefault(); // We don't want to submit this fake form
        var textureSelected = document.querySelector('input[name=texture]:checked').value;
        const repeatX = document.getElementById("repeatx").value;
        const repeatY = document.getElementById("repeaty").value;
        document.body.removeChild(dialog)
        
        const texture = textureHelper.get(textureSelected, repeatX, repeatY);

        cbSetTexture(texture)
    });

    textureImageDialog.showModal();
}