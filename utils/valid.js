export const registerValidate = (email, name, password, cf_password) => {
    if (!name || !email || !password)
        return "Please enter all fields";

    if (!validateEmail(email))
        return "Invalid email.";

    if (password.length < 6)
        return "Password must be at least 6 characters.";

    if (password !== cf_password)
        return "Confirm password did not match.";
}


function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLocaleLowerCase());
}