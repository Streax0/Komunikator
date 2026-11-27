const roompage = {
    strona: 
    `<div class="room">
    <h1>Pokój</h1>
    <p>Kod pokoju: <span id="room-code"></span></p>
</div>`
}

const main = document.querySelector("main");


utworzroom = document.getElementById('create-room-btn').addEventListener('click', async function() {
    const roomCode = generateRoomCode();
    const data = await koddophp(roomCode);

    if (data && data.success) {
        main.innerHTML = roompage['strona'];
        document.getElementById('room-code').textContent = data.code;
    }
    
});


async function koddophp(kod) {
    try {
        const response = await fetch('scripts/room.php', {
            method: 'POST',
            body: JSON.stringify({ code: kod }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Nie udało się zapisać pokoju.');
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
