window.startP2PChat = function(room) {
    const status = document.getElementById('p2p-status');
    const messages = document.getElementById('p2p-messages');
    const form = document.getElementById('p2p-chat-form');
    const messageInput = document.getElementById('p2p-message');
    const roomId = Number(room.room_id);
    let peerId = room.peer_id ? Number(room.peer_id) : null;
    let lastSignalId = 0;
    let polling = false;
    let closed = false;
    let dataChannel = null;
    const pendingCandidates = [];
    if (!window.RTCPeerConnection) {
        status.textContent = 'Ta przeglądarka nie obsługuje WebRTC.';
        return;
    }

    const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    function showStatus(text) {
        status.textContent = text;
    }

    function showError(error) {
        
        showStatus('Błąd połączenia. Odśwież stronę i spróbuj ponownie.');
    }

    function addMessage(text, sender) {
        const message = document.createElement('li');
        message.textContent = sender + ': ' + text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function setupDataChannel(channel) {
        dataChannel = channel;
        dataChannel.onopen = function() {
            showStatus('Połączono bezpośrednio.');
        };
        dataChannel.onclose = function() {
            showStatus('Połączenie zostało zamknięte.');
        };
        dataChannel.onmessage = function(event) {
            if (typeof event.data === 'string') {
                addMessage(event.data, 'Rozmówca');
            }
        };
    }

    async function sendSignal(type, payload) {
        if (!peerId) {
            throw new Error('Nie znaleziono drugiego uczestnika pokoju.');
        }

        const response = await fetch('scripts/signal.php', {
            method: 'POST',
            body: JSON.stringify({
                action: 'send',
                room_id: roomId,
                recipient_id: peerId,
                type: type,
                payload: payload
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Nie udało się wysłać sygnału.');
        }
    }

    async function addPendingCandidates() {
        while (pendingCandidates.length > 0) {
            const candidate = pendingCandidates.shift();
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }

    async function receiveSignal(signal) {
        if (!peerId) {
            peerId = Number(signal.sender_id);
        }

        if (signal.type === 'offer' && room.role === 'host') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.payload));
            await addPendingCandidates();
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            await sendSignal('answer', {
                type: peerConnection.localDescription.type,
                sdp: peerConnection.localDescription.sdp
            });
        } else if (signal.type === 'answer' && room.role === 'guest') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.payload));
            await addPendingCandidates();
        } else if (signal.type === 'ice') {
            if (peerConnection.remoteDescription) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(signal.payload));
            } else {
                pendingCandidates.push(signal.payload);
            }
        }
    }

    async function pollSignals() {
        if (polling || closed) {
            return;
        }

        polling = true;
        try {
            const response = await fetch('scripts/signal.php', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'poll',
                    room_id: roomId,
                    after_id: lastSignalId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Nie udało się pobrać sygnałów.');
            }

            for (const signal of data.signals) {
                lastSignalId = signal.id;
                await receiveSignal(signal);
            }
        } catch (error) {
            showError(error);
        } finally {
            polling = false;
            if (!closed) {
                window.setTimeout(pollSignals, 700);
            }
        }
    }

    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            sendSignal('ice', event.candidate.toJSON()).catch(showError);
        }
    };

    peerConnection.ondatachannel = function(event) {
        setupDataChannel(event.channel);
    };

    peerConnection.onconnectionstatechange = function() {
        if (peerConnection.connectionState === 'failed') {
            showStatus('Nie udało się zestawić połączenia. Ta sieć może wymagać serwera TURN.');
        } else if (peerConnection.connectionState === 'disconnected') {
            showStatus('Połączenie zostało przerwane.');
        }
    };

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const text = messageInput.value.trim();
        if (!text || !dataChannel || dataChannel.readyState !== 'open') {
            return;
        }

        dataChannel.send(text);
        addMessage(text, 'Ty');
        messageInput.value = '';
        messageInput.focus();
    });

    window.addEventListener('pagehide', function() {
        closed = true;
        peerConnection.close();
    });

    async function createOffer() {
        dataChannel = peerConnection.createDataChannel('wiadomosci');
        setupDataChannel(dataChannel);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await sendSignal('offer', {
            type: peerConnection.localDescription.type,
            sdp: peerConnection.localDescription.sdp
        });
        showStatus('Wysyłanie zaproszenia do połączenia...');
    }

    if (room.role === 'guest') {
        createOffer().catch(showError);
    } else {
        showStatus('Czekam na połączenie drugiej osoby...');
    }

    pollSignals();
};