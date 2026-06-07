# PVO-CrisisMode

## Begrijp dit als je een commit message schijft!
https://www.conventionalcommits.org/en/v1.0.0/


## Installatie
1. Clone deze repository
2. cd naar `PVO-CrisisMode/app` en voer `npm install` uit.
3. cd naar `PVO-CrisisMode/server` en voer `npm install` uit.
4. start de server met `npm start` in de `server` map.
5. start de mobile app met `npx capacitor run android` in de `app` map.

<sup>Opmerking: zorg ervoor dat de server en app op het zelfde netwerk zitten, anders kunnen ze niet met elkaar communiceren.</sup>

## API Endpoints
POST `/auth/register`: Registreer een nieuwe gebruiker.
Input:
```
{
    Voornaam: "John",
    Achternaam: "Doe"
    Username: "johndoe",
    email: "john@example.com",
    password: "password123"
}
```
Response:
```
{
    message: "Registratie succesvol",
}
```
Of 
```
{
    errors: {
        "voornaam": "Voornaam is verplicht",
        "achternaam": "Achternaam is verplicht",
        ...
    }
}
```
Of
```
{
    errors: {
        Username: { unique: false, message: 'Username is al in gebruik' },
        Email: { unique: false, message: 'Email is al in gebruik' }
    }
}
```