
const blokhasla = document.getElementById('password');
const pokazStatus = document.getElementById('ukryjpokaz').addEventListener('click', () => {
    attribut = blokhasla.nodeType;
    if (blokhasla.type === 'password') {
        blokhasla.type = 'text';
    } else {
        blokhasla.type = 'password';
    }
});
