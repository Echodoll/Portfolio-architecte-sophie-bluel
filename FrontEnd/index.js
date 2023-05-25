
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

//********Fonction comprennant la création des filtres et le filtrage *******
/*document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal())
    const target = document.querySelector('.link_modal');

})
const openModal = function (e) {
    e.preventDefault();
}*/


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

    const modalGallery = document.querySelector('.gallery_modal');
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

init();
const logoutButton = document.getElementById('logout');
const token = localStorage.getItem('token');


if (token) {
    logoutButton.textContent = "logout";
    document.getElementById("modal__header").style.display = "block";

}
logoutButton.addEventListener('click', function () {
    if (token) {
        localStorage.removeItem('token')
        document.getElementById("modal__header").style.display = "none";
    }
    window.location.href = "./index.html";
})
