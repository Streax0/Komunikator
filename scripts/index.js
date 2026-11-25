const menuDiv = document.getElementById("menu-div");
const bgDiv = document.getElementById("bg-div");
const burger = document.querySelector("#burger .burger-toggle");

function closeMenu() {
    menuDiv.classList.remove("otwarte");
    bgDiv.classList.remove("otwarte");
    menuDiv.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Otwórz menu");
    burger.closest("#burger").classList.remove("otwarte");
}

burger.addEventListener("click", () => {
    const isOpen = burger.getAttribute("aria-expanded") !== "true";
    menuDiv.classList.toggle("otwarte", isOpen);
    bgDiv.classList.toggle("otwarte", isOpen);
    menuDiv.setAttribute("aria-hidden", String(!isOpen));
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
    burger.closest("#burger").classList.toggle("otwarte", isOpen);
});

bgDiv.addEventListener("click", closeMenu);
menuDiv.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

function burgerf(){
    console.log('kappi') //debug
    
}

function wyswietlczat() {
    const czat = document.querySelector('.czat');
    const placeholder = document.getElementById('placeholder');
}