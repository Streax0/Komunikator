const roompage = {
    strona: 
    `<div class="room">
    <h1>Pokój</h1>
    <p>Kod pokoju: <span id="room-code"></span></p>
</div>`
}

const main = document.querySelector("main");


utworzroom = document.getElementById('create-room-btn').addEventListener('click', function() {
    const roomCode = generateRoomCode();
    main.innerHTML = roompage['strona'];
    document.getElementById('room-code').textContent = roomCode;
    
});





function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const random = new Uint8Array(8);
    crypto.getRandomValues(random);
    return Array.from(random, (byte) => characters[byte % characters.length]).join('');
}
