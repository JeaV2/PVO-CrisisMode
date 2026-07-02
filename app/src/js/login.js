import { Preferences } from '@capacitor/preferences';

import { SERVER_IP, SERVER_PORT } from './variables.js';

document.getElementById('signup').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const resultDiv = document.getElementById('result');

    const Data = {
        "Email": email,
        "Wachtwoord": password
    }

    try {
        const response = await fetch(`http://${SERVER_IP}:${SERVER_PORT}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Data)
        });

        const result = await response.json();

        if (response.ok) {
            const token = JSON.stringify(result.token)
            await Preferences.set({
                key: 'token',
                value: token,
            });
            window.location.replace("lespad.html")
            resultDiv.className = 'success';
            e.target.reset();
        } else {
            resultDiv.textContent = 'Error: ' + JSON.stringify(result, null, 2);
            resultDiv.className = 'error';
        }
    } catch (error) {
        resultDiv.textContent = 'Fetch error: ' + error.message;
        resultDiv.className = 'error';
    }

})

