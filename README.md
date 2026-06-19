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

### Registratie

POST `/auth/register`: Registreer een nieuwe gebruiker.
Input:
```
{
    Voornaam: "John",
    Achternaam: "Doe"
    Username: "johndoe",
    Email: "john@example.com",
    Wachtwoord: "password123"
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

### Inloggen

POST `/auth/login`: Log in met een bestaande gebruiker.
Input:
```
{
    Email: "john@example.com",
    Wachtwoord: "password123"
}
```

Response:
```
{
    message: "Login succesvol",
    token: "<JWT Token>"
}
```
Of
```
{
    message: "Ongeldige inloggegevens"
}
```
Of 
```
{
    errors: {
        "email": "Email is verplicht",
        "wachtwoord": "Wachtwoord is verplicht"
    }
}
```

### Medailles

GET `/medals`: Haal een lijst van alle medailles van de gebruiker op.
Input:
```
Headers: {
    Authorization: "Bearer <JWT Token>"
}
```
<sup>Let op, deze data is geen json body, maar een header, de JWT token moet in de Authorization header worden meegegeven.</sup>
Response:
```
{
  "message": "Token validated",
  "medals": {
    "UUID": "de877a66-1b9e-4b4e-bad2-29b8f053f7a6",
    "Casus1": "bronze",
    "Casus2": "zilver",
    "Casus3": "goud",
    "Casus4": "goud",
    "Casus5": "zilver",
    "Casus6": "bronze",
    "Casus7": "zilver",
    "Casus8": "goud",
    "Casus9": "zilver",
    "Casus10": "goud"
  }
}
```
Of
```
{
    message: "Authorization header mist of is ongeldig"
}
```
Of 
```
{
    message: "Token ontbreekt"
}
```
Of
```
{
    message: "Foute of verlopen token"
}
```