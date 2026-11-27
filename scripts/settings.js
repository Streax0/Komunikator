
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
        <p>Zmień hasło</p>
        <p>Stare hasło: <input type="password" name="oldpassword" id="oldpassword"><br></p>
        <p>Nowe hasło: <input type="password" name="newpassword" id="newpassword"><br></p>
        <p>Potwierdź nowe hasło: <input type="password" name="confirmnewpassword" id="confirmnewpassword"><br></p>
        <button type="submit">Zmień hasło</button>
    `,
    prywatnosc: `
        <div>
            <h1>Ustawnienia Prywatnosci<h1>
        </div>
        <p>Ustawienia aktywności</p>
        <label><input type="radio" name="activity" value="show">Online</label><br>
        <label><input type="radio" name="activity" value="hide">Zaraz wracam</label><br>
        <label><input type="radio" name="activity" value="afk">Nie przeszkadzać</label><br>
        <label><input type="radio" name="activity" value="invisible">Offline</label><br>
        <label><input type="radio" name="activity" value="offline">Prywatne</label><br>
    `,
    powiadomienia: `
        <div>
            <h1>Ustawnienia Powiadomien<h1>
        </div>
        <p>Ustawienia wyglądu</p>
        <label><input type="radio" name="appearance">Motyw jasny</label><br>
        <label><input type="radio" name="appearance">Motyw ciemny</label><br>
    `,
    wyglad: `
        <div>
            <h1>Ustawnienia Wygladu<h1>
        </div>
        <p>Ustawienia powiadomień</p>
        <label><input type="radio" name="notifications">Powiadomienia włączone</label><br>
        <label><input type="radio" name="notifications">Powiadomienia wyłączone</label><br>
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
        default:
            main.innerHTML = strony['profil'] 
            break


    }
}
