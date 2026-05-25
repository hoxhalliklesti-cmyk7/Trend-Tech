function setCookie(name, value, days) {
    let expires = "";

    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i];

        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }

        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length);
        }
    }

    return null;
}

function acceptCookies() {
    setCookie("cookiesAccepted", "true", 30);

    document.getElementById("cookie-banner").style.display = "none";
}

window.onload = function () {
    const accepted = getCookie("cookiesAccepted");

    if (accepted) {
        document.getElementById("cookie-banner").style.display = "none";
    }
};