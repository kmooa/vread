//Applies feather effect on images

export default function featherize(src, fun){

    let canvas = document.createElement('canvas');

    let img = new Image();
    img.src = src;

    img.onload = function() {

        let height = 600,
            width = 800;

        let ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        ctx.drawImage(img, 0, 0, height, width);

        let image = ctx.getImageData(0, 0, height, width);
        let imageData = image.data,
            length = imageData.length;
        for(let i=3; i < length; i+=4){
            if(i < (height / 4 * width )* 4 ) {
                imageData[i] = Math.floor(i / height * 4) * 255 / height / 4;
            }
            else imageData[i] = 255;
        }
        // noinspection JSAnnotator
        image.data = imageData;
        ctx.putImageData(image, 0, 0);

        if(fun) fun(canvas.toDataURL());
    }
}