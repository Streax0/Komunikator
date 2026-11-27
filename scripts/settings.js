
const menub = document.querySelectorAll("#menub");
const main = document.querySelector("main");

menub.forEach(element => {
    element.addEventListener('click', przelaczanie)
});


const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? "";
const savedSettings = window.savedSettings ?? {};

async function saveSettings(payload) {
    const response = await fetch("settings_save.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ ...payload, csrf_token: csrfToken })
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Nie udało się zapisać ustawień.");
    }
    return result;
}

function setCheckedValue(name, value) {
    const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (input) {
        input.checked = true;
    }
}

const strony = {
    profil: `
        <div>
            <h1>Ustawienia Konta</h1>
        </div>
        <form id="password-form">
            <p>Zmień hasło</p>
            <p>Stare hasło: <input type="password" name="oldpassword" id="oldpassword" required><br></p>
            <p>Nowe hasło: <input type="password" name="newpassword" id="newpassword" minlength="8" required><br></p>
            <p>Potwierdź nowe hasło: <input type="password" name="confirmnewpassword" id="confirmnewpassword" minlength="8" required><br></p>
            <button type="submit">Zmień hasło</button>
            <p class="settings-status" role="status"></p>
        </form>
    `,
    prywatnosc: `
        <div>
            <h1>Ustawienia Prywatności</h1>
        </div>
        <form data-settings-form="aktywnosc">
            <p>Ustawienia aktywności</p>
            <label><input type="radio" name="activity" value="online">Online</label><br>
            <label><input type="radio" name="activity" value="zaraz_wracam">Zaraz wracam</label><br>
            <label><input type="radio" name="activity" value="nie_przeszkadzac">Nie przeszkadzać</label><br>
            <label><input type="radio" name="activity" value="offline">Offline</label><br>
            <label><input type="radio" name="activity" value="prywatne">Prywatne</label><br>
            <button type="submit">Zapisz</button>
            <p class="settings-status" role="status"></p>
        </form>
    `,
    powiadomienia: `
        <div>
            <h1>Ustawienia Powiadomień</h1>
        </div>
        <form data-settings-form="powiadomienia">
            <p>Ustawienia powiadomień</p>
            <label><input type="radio" name="notifications" value="1">Powiadomienia włączone</label><br>
            <label><input type="radio" name="notifications" value="0">Powiadomienia wyłączone</label><br>
            <button type="submit">Zapisz</button>
            <p class="settings-status" role="status"></p>
        </form>
    `,
    wyglad: `
        <div>
            <h1>Ustawienia Wyglądu</h1>
        </div>
        <form data-settings-form="motyw">
            <p>Ustawienia wyglądu</p>
            <label><input type="radio" name="appearance" value="0">Motyw jasny</label><br>
            <label><input type="radio" name="appearance" value="1">Motyw ciemny</label><br>
            <button type="submit">Zapisz</button>
            <p class="settings-status" role="status"></p>
        </form>
    `
}

function przelaczanie() {
    switch(this?.value){
        case '1':
            main.innerHTML = strony['profil'];
            bindPasswordForm();
            break;
        case '2':
            main.innerHTML = strony['prywatnosc'];
            setCheckedValue("activity", savedSettings.aktywnosc);
            bindSettingsForm();
            break;
        case '3':
            main.innerHTML = strony['powiadomienia'];
            setCheckedValue("notifications", String(savedSettings.powiadomienia ?? 1));
            bindSettingsForm();
            break;
        case '4':
            main.innerHTML = strony['wyglad'];
            setCheckedValue("appearance", String(savedSettings.motyw ?? 0));
            bindSettingsForm();
            break;
        default:
            main.innerHTML = strony['profil'];
            bindPasswordForm();
            break;
    }
}

function bindSettingsForm() {
    document.querySelectorAll("[data-settings-form]").forEach(form => {
        form.addEventListener("submit", async event => {
            event.preventDefault();
            const status = form.querySelector(".settings-status");
            const type = form.dataset.settingsForm;
            const field = type === "aktywnosc" ? "activity"
                : type === "powiadomienia" ? "notifications"
                : "appearance";
            const selected = form.querySelector(`[name="${field}"]:checked`);

            if (!selected) {
                status.textContent = "Wybierz ustawienie.";
                return;
            }

            try {
                const payload = type === "aktywnosc"
                    ? { action: "settings", aktywnosc: selected.value }
                    : type === "powiadomienia"
                        ? { action: "settings", powiadomienia: Number(selected.value) }
                        : { action: "settings", motyw: Number(selected.value) };

                await saveSettings(payload);
                savedSettings[type] = type === "aktywnosc" ? selected.value : Number(selected.value);
                if (type === "motyw") {
                    localStorage.setItem("komunikator-theme", Number(selected.value) === 1 ? "dark" : "light");
                    document.documentElement.dataset.theme = Number(selected.value) === 1 ? "dark" : "light";
                }
                status.textContent = "Zapisano.";
            } catch (error) {
                status.textContent = error.message;
            }
        });
    });
}

function bindPasswordForm() {
    const form = document.getElementById("password-form");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const status = form.querySelector(".settings-status");
        const oldPassword = form.elements.oldpassword.value;
        const newPassword = form.elements.newpassword.value;
        const confirmPassword = form.elements.confirmnewpassword.value;

        if (newPassword !== confirmPassword) {
            status.textContent = "Nowe hasła nie są zgodne.";
            return;
        }

        try {
            await saveSettings({
                action: "password",
                old_password: oldPassword,
                new_password: newPassword
            });
            form.reset();
            status.textContent = "Zmieniono hasło.";
        } catch (error) {
            status.textContent = error.message;
        }
    });
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
przelaczanie()