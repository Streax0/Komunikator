
const menub = document.querySelectorAll("#menub");
const main = document.querySelector("main");

menub.forEach(element => {
    element.addEventListener('click', przelaczanie)
});


const strony = {
    profil: `
        <div>
            <h1>Ustawnienia Konta<h1>
        </div>
    
    `,
    prywatnosc: `
        <div>
            <h1>Ustawnienia Prywatnosci<h1>
        </div>
    `,
    powiadomienia: `
        <div>
            <h1>Ustawnienia Powiadomien<h1>
        </div>
    `,
    wyglad: `
        <div>
            <h1>Ustawnienia Wygladu<h1>
        </div>
    `
    
}

function przelaczanie() {
    switch(this.value){
        case '1':
            main.innerHTML = strony['profil'] 
            break
        case '2':
            main.innerHTML = strony['prywatnosc'] 
            break
        case '3':
            main.innerHTML = strony['powiadomienia'] 
            break
        case '4':
            main.innerHTML = strony['wyglad'] 
            break  


    }
}
