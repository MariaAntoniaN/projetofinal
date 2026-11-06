function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
  background(255, 45, 200);
  text("Hello, World!", mouseX, mouseY);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
