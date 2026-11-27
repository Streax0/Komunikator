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

const wylogujBtn = document.getElementById("wyloguj").addEventListener("click", () => {
    const popup = `<section id="popup-section" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;z-index: 100000;;"> <div class="popup">
        <p>Czy na pewno chcesz się wylogować?</p>
        <button id="potwierdz-wylogowanie">Tak</button>
        <button id="anuluj-wylogowanie">Nie</button>
    </div></section>`;
    document.body.insertAdjacentHTML('beforeend', popup);
    const potwierdzWylogowanie = document.getElementById("potwierdz-wylogowanie");
    const anulujWylogowanie = document.getElementById("anuluj-wylogowanie");
    if (potwierdzWylogowanie && anulujWylogowanie) {
        potwierdzWylogowanie.addEventListener("click", () => {
        window.location.replace("wyloguj.php");
        });
        anulujWylogowanie.addEventListener("click", () => {
            popupremove = document.getElementById("popup-section");
            if (popupremove) {
                popupremove.remove();
            }
        });

}})




