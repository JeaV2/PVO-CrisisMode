import { Preferences } from '@capacitor/preferences';
const BASE_URL = '';

class Account {
    async accountInfo(token) {
        const response = await fetch(`${BASE_URL}/account`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Account request failed ${response.status}: ${err}`);
        }

        return response.json();
    }

    async medals(token) {
        const response = await fetch(`${BASE_URL}/medals`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Medals request failed ${response.status}: ${err}`);
        }

        return response.json();
    }
}

async function loadAccount() {
    try {
        const { value: token } = await Preferences.get({ key: 'authToken' });
        if (!token) throw new Error("No auth token found");

        const account = new Account();

        const [userData, medals] = await Promise.all([
            account.accountInfo(token),
            account.medals(token)
        ]);

        document.getElementById("username").textContent = userData.username;
        document.getElementById("email").textContent = userData.email;

        const medalsContainer = document.getElementById("medals");
        medalsContainer.innerHTML = '';

        if (medals?.length) {
            medals.forEach(m => {
                const div = document.createElement("div");
                div.textContent = m;
                medalsContainer.appendChild(div);
            });
        } else {
            medalsContainer.textContent = "No medals yet";
        }
    } catch (error) {
        console.error(error);
    }
}

loadAccount();