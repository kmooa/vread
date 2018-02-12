//Applies feather effect on images

function flipHorizontally(ctx, img, x, y){
    ctx.translate(x+img.width,y);
    ctx.scale(-1,1);
    ctx.drawImage(img,0,0);
    ctx.setTransform(1,0,0,1,0,0);
}

function orientCanvas(width, height){
    if(width > height) return 5;
    else return 7
}

function drawImage(ctx, img, width, height){
    ctx.drawImage(img, 0, 0, width, height);
    flipHorizontally(ctx, img, width, 0);
}

function applyFilterProto(canvas, ctx, width, height, repeat){

    let normalImage = ctx.getImageData(0, 10, width, height - 20),
        flippedImage = ctx.getImageData(width, 10, width, height - 20),
        normalImageData = normalImage.data,
        flippedImageData = flippedImage.data,
        length = normalImageData.length;

    for(let i=3; i < length; i+=4){
        if(i < (height * width * 4) / 4 ) {
            flippedImageData[i] = normalImageData[i] = (Math.floor(i / (width * 4)) / (height / 4)) * 255;
            //flippedImageData[i] = normalImageData[i] = 0;
        }
        else {
            flippedImageData[i] = normalImageData[i] = 255;
        }
    }

    let flip = repeat === 7;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    console.log("Starting Flipped in Filter:", flip);
    for(let i = 0; i < repeat; i++){
        if(flip) {
            console.log("Applying flipped:", i)
            ctx.putImageData(flippedImage, i * width, 0);
            flip = false;
        }
        else{
            console.log("Applying normal:", i)
            ctx.putImageData(normalImage, i * width, 0);
            flip = true;
        }
    }
}

function applyFilter(ctx, width, height, repeat){
    let image = ctx.getImageData(0, 0, width, height),
        flippedImage = ctx.getImageData(width, 0, width, height);
    let imageData = image.data,
        flippedImageData = flippedImage.data,
        length = imageData.length;

    for(let i=3; i < length; i+=4){
        if(i < (height * width) ) {
            const opacity = (Math.floor(i / (width * 4)) / (height/4)) * 255;
            imageData[i] = opacity;
            flippedImageData[i] = opacity;
        }
        else {
            imageData[i] = 255;
            flippedImageData[i] = 255;
        }
    }

    // noinspection JSAnnotator
    image.data = imageData;
    // noinspection JSAnnotator
    flippedImage.data = flippedImageData;

    let flip = repeat !== 7;
    console.log("Starting Flipped in Filter:", flip);
    for(let i = 0; i < repeat; i++){
        if(flip) {
            console.log("Applying flipped:", i)
            ctx.putImageData(flippedImage, i * width, 0);
            flip = false;
        }
        else{
            console.log("Applying normal:", i)
            ctx.putImageData(image, i * width, 0);
            flip = true;
        }
    }
}

export default function featherize(src, fun){

    let canvas = document.createElement('canvas');

    let img = new Image();

    img.src = src;

    img.onload = function() {

        let ctx = canvas.getContext('2d');

        let height = img.naturalHeight,
            width = img.naturalWidth;

        let repeat = orientCanvas(width, height);

        canvas.height = height;
        canvas.width = width * repeat;

        drawImage(ctx, img, width, height);
        applyFilterProto(canvas, ctx, width, height, repeat);

        if(fun) fun(canvas.toDataURL());
    }
}