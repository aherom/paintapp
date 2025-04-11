let size = 1;
let isPressed = false;
let color = 'black';
let x = undefined;
let y = undefined;
let isErasing = false;

const canvas = document.getElementById('canvas');
const colorElement = document.getElementById('color');
const sizeSlider = document.getElementById('size-slider');
const sizeValueDisplay = document.getElementById('size-value');
const clear = document.getElementById('clear');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const ctx = canvas.getContext("2d");
const canvasbgcolor = document.getElementById('canvasbgcolor');
const downloadButton = document.getElementById('download');
const brushBtn = document.getElementById('brush-btn');
const eraserBtn = document.getElementById('eraser-btn');

let history = [];
let historyIndex = -1;

// Initialize the size display
sizeValueDisplay.innerText = sizeSlider.value;
size = parseInt(sizeSlider.value);


ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
saveHistory(); 

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    isPressed = true;
    const mousePos = getMousePos(canvas, e);
    x = mousePos.x;
    y = mousePos.y;
});

canvas.addEventListener('mouseout', () => {
    isPressed = false;
    x = undefined;
    y = undefined;
});

canvas.addEventListener('mouseup', () => {
    isPressed = false;
    x = undefined;
    y = undefined;
    saveHistory();
});

canvas.addEventListener('mousemove', (e) => {
    if (isPressed) {
        const mousePos = getMousePos(canvas, e);
        const x2 = mousePos.x;
        const y2 = mousePos.y;
        if (isErasing) {
            erase(x2, y2, x, y);
        } else {
            circle(x2, y2);
            lines(x, y, x2, y2);
        }
        x = x2;
        y = y2;
    }
});

function circle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function lines(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color ;
    ctx.lineWidth = size * 2;
    ctx.stroke();
}

function erase(x2, y2, x1, y1) {
    const eraserWidth = size * 2;
    const enhancedEraserWidth = eraserWidth * 4;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = canvas.style.background || 'white';
    ctx.lineWidth = enhancedEraserWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x2, y2, size * 2, 0, Math.PI * 2);
    ctx.fillStyle = canvas.style.background || 'white';
    ctx.fill();
}

function updateSize() {
    sizeValueDisplay.innerText = size;
    sizeSlider.value = size;
}

function saveHistory() {
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    history.push(canvas.toDataURL());
    historyIndex++;
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        const img = new Image();
        img.src = history[historyIndex];
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        const img = new Image();
        img.src = history[historyIndex];
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(canvas).backgroundColor || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   // saveHistory();
});

colorElement.addEventListener('change', (e) => {
    color = e.target.value;
    isErasing = false;
    brushBtn.classList.add('active');
    eraserBtn.classList.remove('active');
});

canvasbgcolor.addEventListener('change', (e) => {
    const newBgColor = e.target.value;
    canvas.style.background = newBgColor;
    ctx.fillStyle = newBgColor; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
});


sizeSlider.addEventListener('input', () => {
    size = parseInt(sizeSlider.value);
    sizeValueDisplay.innerText = size;
});


brushBtn.addEventListener('click', () => {
    isErasing = false;
    brushBtn.classList.add('active');
    eraserBtn.classList.remove('active');
});

eraserBtn.addEventListener('click', () => {
    isErasing = true;
    eraserBtn.classList.add('active');
    brushBtn.classList.remove('active');
});

downloadButton.addEventListener('click', () => {
    saveHistory();
    const dataURL = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.jpg';
    link.click();
    const lastState = new Image();
    lastState.src = history[history.length - 1];
    lastState.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(lastState, 0, 0);
    };
});

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);