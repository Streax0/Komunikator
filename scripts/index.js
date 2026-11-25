const menuDiv = document.getElementById("menu-div");
const bgDiv = document.getElementById("bg-div");
const burger = document.getElementById("burger").addEventListener('click', () => {
    menuDiv.classList.toggle("otwarte");
    bgDiv.classList.toggle("otwarte");
})

bgDiv.addEventListener('click', () => {
    menuDiv.classList.remove("otwarte");
    bgDiv.classList.remove("otwarte");
});

function burgerf(){
    console.log('kappi') //debug
    
}

function wyswietlczat() {
    const czat = document.querySelector('.czat');
    const placeholder = document.getElementById('placeholder');
}