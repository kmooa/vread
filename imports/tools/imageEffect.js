//Applies feather effect on images

export default function featherize(src, fun){

  let canvas = document.createElement('canvas');

  let img = new Image();

  img.src = src;



  img.onload = function() {

    let height = img.naturalHeight,
      width = img.naturalWidth;

    canvas.height = height;
    canvas.width = width * 4;

    let ctx = canvas.getContext('2d');

    function flipHorizontally(img,x,y){
      // move to x + img's width
      ctx.translate(x+img.width,y);

      // scaleX by -1; this "trick" flips horizontally
      ctx.scale(-1,1);

      // draw the img
      // no need for x,y since we've already translated
      ctx.drawImage(img,0,0);

      // always clean up -- reset transformations to default
      ctx.setTransform(1,0,0,1,0,0);
    }

    ctx.drawImage(img, 0, 0, width, height);
    flipHorizontally(img, width, 0);
    ctx.drawImage(img, width * 2, 0, width, height);
    flipHorizontally(img, width * 3, 0);

    let image = ctx.getImageData(0, 0, width, height),
        flippedImage = ctx.getImageData(width, 0, width, height);
    let imageData = image.data,
        flippedImageData = flippedImage.data,
        length = imageData.length;
    for(let i=3; i < length; i+=4){
      if(i < (height / 4 * width )* 4 ) {
        imageData[i] = Math.floor(i / height * 4) * 255 / height / 4;
        flippedImageData[i] = Math.floor(i / height * 4) * 255 / height / 4;
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

    ctx.putImageData(image, 0, 0);
    ctx.putImageData(flippedImage, width, 0);
    ctx.putImageData(image, width * 2, 0);
    ctx.putImageData(flippedImage, width * 3, 0);

    if(fun) fun(canvas.toDataURL());
  }
}