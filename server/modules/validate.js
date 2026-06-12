function validateSignUpData(data = {}) {
    const errors = {};

    if (!data.Voornaam || data.Voornaam.trim() === '') {
        errors.Voornaam = 'Voornaam is verplicht';
    } else if (data.Voornaam.trim().length < 2) {
        errors.Voornaam = 'Voornaam moet minimaal 2 tekens bevatten';
    }

    if (!data.Achternaam || data.Achternaam.trim() === '') {
        errors.Achternaam = 'Achternaam is verplicht';
    } else if (data.Achternaam.trim().length < 2) {
        errors.Achternaam = 'Achternaam moet minimaal 2 tekens bevatten';
    }

    if (!data.Username || data.Username.trim() === '') {
        errors.Username = 'Username is verplicht';
    } else if (data.Username.trim().length < 2) {
        errors.Username = 'Username moet minimaal 2 tekens bevatten';
    }

    if (!data.Email || data.Email.trim() === '') {
        errors.Email = 'Email is verplicht';
    } else if (!validateEmail(data.Email)) {
        errors.Email = 'Ongeldig emailadres';
    }

    if (!data.Wachtwoord || data.Wachtwoord.trim() === '') {
        errors.Wachtwoord = 'Wachtwoord is verplicht';
    } else if (data.Wachtwoord.trim().length < 6) {
        errors.Wachtwoord = 'Wachtwoord moet minimaal 6 tekens bevatten';
    }
    if (validatePassword(data.Wachtwoord).length > 0) {
        errors.Wachtwoord = validatePassword(data.Wachtwoord).join(', ');
    }

    return errors;
}

function validateLoginData(data = {}) {
    const errors = {};

    if (!data.Email || data.Email.trim() === '') {
        errors.Email = 'Email is verplicht';
    } else if (!validateEmail(data.Email)) {
        errors.Email = 'Ongeldig emailadres';
    }

    if (!data.Wachtwoord || data.Wachtwoord.trim() === '') {
        errors.Wachtwoord = 'Wachtwoord is verplicht';
    }

    return errors;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordErrors = [];

    if (password.length < 6) {
        passwordErrors.push('Wachtwoord moet minimaal 6 tekens bevatten');
    }
    if (!/[A-Z]/.test(password)) {
        passwordErrors.push('Wachtwoord moet minimaal één hoofdletter bevatten');
    }
    if (!/[a-z]/.test(password)) {
        passwordErrors.push('Wachtwoord moet minimaal één kleine letter bevatten');
    }
    if (!/[0-9]/.test(password)) {
        passwordErrors.push('Wachtwoord moet minimaal één cijfer bevatten');
    }
    if (!/[@$!%*?&]/.test(password)) {
        passwordErrors.push('Wachtwoord moet minimaal één speciaal teken bevatten (@, $, !, %, *, ?, &)');
    }

    return passwordErrors;
}

export { validateSignUpData, validateLoginData };