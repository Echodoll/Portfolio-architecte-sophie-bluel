
function requestLogin() {
    return fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "email": stockInputEmail,
            "password": stockInputPassword,
        })
    })
}

const inputPassword = document.querySelector('input[type="password"]');
const inputEmail = document.querySelector('input[type="email"]');
const submit = document.querySelector('input[type="submit"]');
const error = document.querySelector('.error')

let stockInputPassword = inputPassword.value;
let stockInputEmail = inputEmail.value;


submit.addEventListener('click', (e) => {
    e.preventDefault();
    stockInputEmail = inputEmail.value;
    stockInputPassword = inputPassword.value;
    if (stockInputEmail === null || stockInputPassword === null) {
        error.innerHTML = "";
    } else {
        requestLogin()
            .then((response) => response.json())
            .then(login => {
                console.log(login);
                if (login.token) {
                    localStorage.setItem('token', login.token);
                    window.location.href = "./index.html"

                } else {
                    console.error("Le token n'a pas été trouvé");
                    error.innerHTML = "Identifiant ou Mot de passe incorrect"
                };
            });
    }
});
inputEmail.addEventListener('input', (e) => {
    e.preventDefault();
    console.log(e.target.value);

});
inputPassword.addEventListener('input', (e) => {
    console.log(e.target.value);
});
