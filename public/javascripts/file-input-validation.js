
const files = document.querySelector('#file-input');

let noFiles=0;

files.addEventListener('onclick',(e)=>{

    noFiles++;

    if(noFiles==3)console.log('hey vuddy');
})