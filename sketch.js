// Letras
let letters = [];
let font;
let offsetX = 0;
let offsetY = 0;
let draggedLetter = null;

// rato e espaçamentos
let cursorX = 150; 
let cursorY = 450; 
let lineHeight = 55; 
let espacoExtraLetras = 2; 

//som
let typing;

// Botões
let btnPrint, btnMusic, btnLixo;

//Seleção
let isSelectingBox = false;
let selectStartX = 0, selectStartY = 0;
let selectedLetters = [];
let isDraggingGroup = false;
let groupOffsets = [];

async function setup(){
  createCanvas(windowWidth, windowHeight);

  // Estilização do texto
  textSize(32);
  textAlign(CENTER, CENTER);
  font = await loadFont('/font/SpecialElite-Regular.ttf');
  textFont(font);
  typing = await loadSound('/mp3/typing.MP3');

  //texto inicial
  let fraseInicial = "Escreva a Sua Própria Arte";
 let larguraTotal = 0;
  for (let i = 0; i < fraseInicial.length; i++) {
    let c = fraseInicial[i];
    if (c === ' ') {
      larguraTotal += 20;
    } else {
      larguraTotal += textWidth(c) + espacoExtraLetras;
    }
  }

//texto inicial
  let xAtual = (width - larguraTotal) / 2;


  for (let i = 0; i < fraseInicial.length; i++) {
    let c = fraseInicial[i];
    let w = textWidth(c);
    
    if (c === ' ') {
      xAtual += 20;
    } else {
      letters.push({
        char: c,
        x: xAtual + w / 2,
        y: height / 2 
      });
      xAtual += w + espacoExtraLetras;
    }
  }
  
  cursorX = width / 2 - 350; 
  cursorY = height / 2 + lineHeight;


  //botões
    //Salvar
    btnPrint = createButton('Salvar');
    btnPrint.position(20, 20);
    btnPrint.style('padding', '10px 65px');
    btnPrint.style('background-color', '#000000');
    btnPrint.style('color', '#ffffff');
    btnPrint.style('border-radius', '10px');
    btnPrint.style('border', 'none');
    btnPrint.style('font-family', 'font');
    btnPrint.style('font-size', '16px');
    btnPrint.style('cursor', 'pointer');
    btnPrint.mousePressed(tirarPrint);

    //musica
    btnMusic = createButton('Música');
    btnMusic.position(200, 20);
    btnMusic.style('padding', '10px 65px');
    btnMusic.style('background-color', '#000000');
    btnMusic.style('color', '#ffffff');
    btnMusic.style('border-radius', '10px');
    btnMusic.style('border', 'none');
    btnMusic.style('font-family', 'font');
    btnMusic.style('font-size', '16px');
    btnMusic.style('cursor', 'pointer');
    btnMusic.mousePressed(tocarMusicaDasLetras);

    //lixo
    btnLixo = createButton('Lixo');
    btnLixo.position(386, 20);
    btnLixo.style('padding', '10px 65px');
    btnLixo.style('background-color', '#000000');
    btnLixo.style('color', '#ffffff');
    btnLixo.style('border-radius', '10px');
    btnLixo.style('border', 'none');
    btnLixo.style('font-family', 'font');
    btnLixo.style('font-size', '16px');
    btnLixo.style('cursor', 'pointer');
}

function draw() {
  background('#dfd3c4');

  //seleção
  if (isDraggingGroup) {
    for (let i = 0; i < selectedLetters.length; i++) {
      let l = selectedLetters[i];
      l.x = mouseX - groupOffsets[i].x;
      l.y = mouseY - groupOffsets[i].y;
    }
  }

  if (isSelectingBox) {
    stroke(0, 102, 204);
    fill(0, 102, 204, 50);
    rect(selectStartX, selectStartY, mouseX - selectStartX, mouseY - selectStartY);
  }

  noStroke();
  for (let i = 0; i < letters.length; i++) {
    let l = letters[i];
    
    if (selectedLetters.includes(l)) {
      fill(0, 102, 204, 80);
      ellipse(l.x, l.y, textSize() * 1.2);
    }
    
    fill(0);
    text(l.char, l.x, l.y);
  }
}

function mousePressed() {

  if (mouseY < 70 && mouseX < 600) return;

  let clickedOnLetter = null;

  for (let i = letters.length - 1; i >= 0; i--) {
    let l = letters[i];
    let w = textWidth(l.char);
    let h = textSize();
    
    if (mouseX >= l.x - w/2 && mouseX <= l.x + w/2 && mouseY >= l.y - h/2 && mouseY <= l.y + h/2) {
      clickedOnLetter = l;
      break;
    }
  }

  if (clickedOnLetter) {
    if (selectedLetters.includes(clickedOnLetter)) {
      isDraggingGroup = true;
      groupOffsets = selectedLetters.map(l => ({ x: mouseX - l.x, y: mouseY - l.y }));
    } else {
      selectedLetters = [clickedOnLetter];
      isDraggingGroup = true;
      groupOffsets = [{ x: mouseX - clickedOnLetter.x, y: mouseY - clickedOnLetter.y }];
    }
  } else {
  
    isSelectingBox = true;
    selectStartX = mouseX;
    selectStartY = mouseY;
    selectedLetters = [];
  }
}

function mouseDragged() {
  if (isSelectingBox) {
    let minX = min(selectStartX, mouseX);
    let maxX = max(selectStartX, mouseX);
    let minY = min(selectStartY, mouseY);
    let maxY = max(selectStartY, mouseY);

    selectedLetters = letters.filter(l => l.x >= minX && l.x <= maxX && l.y >= minY && l.y <= maxY);
  }
}

function mouseReleased() {
  isSelectingBox = false;
  isDraggingGroup = false;

  if (draggedLetter || selectedLetters.length > 0) {
    let lixoBox = btnLixo.elt.getBoundingClientRect();
    
    if (mouseX >= lixoBox.left && mouseX <= lixoBox.right && mouseY >= lixoBox.top && mouseY <= lixoBox.bottom) {
      if (draggedLetter) {
        letters = letters.filter(l => l !== draggedLetter);
      }
      if (selectedLetters.length > 0) {
        letters = letters.filter(l => !selectedLetters.includes(l));
        selectedLetters = [];
      }
    }
  }
}

// Letras posição
function keyTyped() {
  if (key.length === 1) {
    let larguraLetra = textWidth(key);
    
    
    let limiteDireito = width - 350; 
    
    if (cursorX > limiteDireito) {
      cursorX = width / 2 - 350; 
      cursorY += lineHeight;     
    }

    letters.push({ 
      char: key, 
      x: cursorX + larguraLetra / 2, 
      y: cursorY 
    });
    
    cursorX += larguraLetra + espacoExtraLetras;
    
      typing.play();
    
  }
}

// espaço e enter
function keyPressed() {
  if (keyCode === ENTER || keyCode === RETURN) {
    cursorX = 150;         
    cursorY += lineHeight; 
  } 
  else if (key === 'Backspace' && letters.length > 0) {
    letters.pop();
    typing.play();
  }
    
}

//salvar
function tirarPrint() {
  saveCanvas('pieceofart', 'png');
}

//musica
function tocarMusicaDasLetras() {
  userStartAudio();
  let letrasOrdenadas = [...letters].sort((a, b) => a.x - b.x);

  for (let i = 0; i < letrasOrdenadas.length; i++) {
    let l = letrasOrdenadas[i];
    if (l.char.trim() === '') continue;

    let codigoAscii = l.char.charCodeAt(0);
    let frequencia = map(codigoAscii % 40, 0, 40, 150, 800);
    let atraso = i * 200; 

    setTimeout(() => {
      tocarNota(frequencia, 0.15);
    }, atraso);
  }
}

function tocarNota(freq, duracao) {
  let osc = new p5.Oscillator('sine');
  osc.freq(freq);
  osc.amp(0.3);
  osc.start();
  setTimeout(() => osc.stop(), duracao * 1000);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}