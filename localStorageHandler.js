// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
const saveLocalButton = document.getElementById('save-local');
const getLocalButton = document.getElementById('get-local');

const LOCAL_STORAGE_KEY = 'canvasDrawing';

function saveCanvasToLocalStorage() {
    const imageData = canvas.toDataURL();
    localStorage.setItem(LOCAL_STORAGE_KEY, imageData);
    alert('Canvas saved to local storage!');
}

function getCanvasFromLocalStorage() {
    const savedImageData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedImageData) {
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = savedImageData;
    } else {
        alert('No canvas data found in local storage.');
    }
}

// Attach event listeners (Alternative - you can do this in the main script.js)
saveLocalButton.addEventListener('click', saveCanvasToLocalStorage);
getLocalButton.addEventListener('click', getCanvasFromLocalStorage);