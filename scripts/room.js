const roompage = {
    strona: 
    `<div class="room">
        <h1>Pokój</h1>
        <p>Kod pokoju: <span id="room-code"></span></p>
    </div>
    <div>
        <p id="p2p-status">Łączenie...</p>
        <ol id="p2p-messages" aria-live="polite"></ol>
        <form id="p2p-chat-form">
            <input id="p2p-message" type="text" maxlength="1000" placeholder="Napisz wiadomość" autocomplete="off" required>
            <button type="submit">Wyślij</button>
        </form>
    </div>`
};

const main = document.querySelector("main");
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const roomCodeInput = document.getElementById('room-code-input');
const roomStatus = document.getElementById('room-status');

createRoomBtn.addEventListener('click', async function() {
    const roomCode = generateRoomCode();
    const data = await koddophp('create', roomCode);

    if (data && data.success) {
        wyswietlPokoj(data);
        roomStatus.textContent = 'Pokój utworzony. Czekam na drugą osobę.';
    } else {
        roomStatus.textContent = 'Nie udało się utworzyć pokoju.';
    }
});

joinRoomBtn.addEventListener('click', async function() {
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    if (!/^[A-Z0-9]{8}$/.test(roomCode)) {
        roomStatus.textContent = 'Nieprawidłowy kod pokoju. Kod powinien mieć 8 znaków.';
        return;
    }

    const data = await koddophp('join', roomCode);
    if (data && data.success) {
        wyswietlPokoj(data);
        roomStatus.textContent = 'Dołączono do pokoju. Łączenie...';
    } else {
        roomStatus.textContent = 'Nie udało się dołączyć do pokoju.';
    }
});

function wyswietlPokoj(data) {
    main.innerHTML = roompage['strona'];
    document.getElementById('room-code').textContent = data.code;
    window.startP2PChat(data);
}

async function koddophp(akcja, kod) {
    try {
        const response = await fetch('scripts/room.php', {
            method: 'POST',
            body: JSON.stringify({ action: akcja, code: kod }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Nie udało się obsłużyć pokoju.');
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const random = new Uint8Array(8);
    crypto.getRandomValues(random);
    return Array.from(random, (byte) => characters[byte % characters.length]).join('');
}
