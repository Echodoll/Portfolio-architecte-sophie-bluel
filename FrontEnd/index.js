
//----------- Récupération des API -------------------------
function init() {
    fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then(works => {
            worksData = works;
            console.log(works);
        });
    fetch("http://localhost:5678/api/categories")
        .then((response) => response.json())
        .then(categories => {
            displayProjectAndCategories(worksData, categories);
        })
};

//------------------------------- Affichage des catégories et projets ---------------------------------------------------------------------------
//-------------------------------------------------------------------

function displayProjectAndCategories(worksData, categories) {

    const portFolio = document.getElementById("portfolio");
    const buttonDiv = document.createElement('div');
    portFolio.appendChild(buttonDiv)
    const buttonADD = document.createElement('button')
    buttonADD.textContent = "Tous ";
    buttonADD.addEventListener('click', () => {
        displayWorks(worksData);
    });
    displayModalsGallery(worksData);
    buttonADD.classList.add('button_category');
    buttonDiv.classList.add('button_div')
    buttonDiv.appendChild(buttonADD);
    categories.forEach(category => {
        const buttonCategory = document.createElement('button');
        buttonCategory.textContent = category.name;
        buttonCategory.classList.add('button_category');
        buttonCategory.addEventListener('click', () => {
            console.log(category.name);
            const filterWorks = worksData.filter(work => {
                return work.category.name === category.name;
            })
            displayWorks(filterWorks);
        });
        buttonDiv.appendChild(buttonCategory);
    });
    const secondChild = portFolio.children[1];
    portFolio.insertBefore(buttonDiv, secondChild);
    displayWorks(worksData);

};

//**********/ Fonction qui comprend l'affichage des images **********

function displayWorks(works) {

    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    works.forEach(project => {
        const figure = document.createElement("figure");
        figure.innerHTML =
            `
                <img src="${project.imageUrl}">
                <figcaption">${project.title}</figcaption>
            `;
        gallery.appendChild(figure)
    });
};
function displayModalsGallery(works) {

    const modalGallery = document.querySelector('.gallery__modal');
    works.forEach(project => {
        const figure = document.createElement("figure");
        figure.innerHTML =
            `
                <img src="${project.imageUrl}">
                <figcaption">éditer</figcaption>
            `;
        modalGallery.appendChild(figure)
    });
};

const logoutButton = document.getElementById('logout');
const token = localStorage.getItem('token');
linkModals = document.getElementsByClassName("link__modal")
//espace administrateur

if (token) {
    logoutButton.textContent = "logout";
    document.getElementById("modal__header").style.visibility = "visible";
    document.querySelector("header").style.marginTop = "100px "
    for (let i = 0; i < linkModals.length; i++) {
        linkModals[i].style.visibility = "visible";
    }


}
logoutButton.addEventListener('click', function () {
    if (token) {
        localStorage.removeItem('token')
        document.getElementById("modal__header").style.visibility = "visible";
        for (let i = 0; i < linkModals.length; i++) {
            linkModals[i].style.visibility = "hidden"
        }
        init();
    }
    window.location.href = "index.html";
})
const modalLink = document.querySelector(".link__modal__porfolio");

init();
modalLink.addEventListener('click', () => {
    const modal = document.querySelector(".modal");
    modal.style.visibility = "visible";
    const closeIcon = document.querySelector('.close__icon');
    closeIcon.addEventListener('click', () => {
        modal.style.visibility = "hidden";
    });
});
