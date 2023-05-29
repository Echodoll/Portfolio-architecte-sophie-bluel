
const logoutButton = document.getElementById('logout');
const token = localStorage.getItem('token');
const linkModals = document.getElementsByClassName("link__modal")
const modalLink = document.querySelector(".link__modal__porfolio");

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
init();

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

// Fonction qui affiche les images dans la modal ----------------
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




//espace administrateur

if (token) {
    logoutButton.textContent = "logout";
    document.getElementById("modal__header").style.visibility = "visible";
    document.querySelector("header").style.marginTop = "100px "
    for (let i = 0; i < linkModals.length; i++) {
        linkModals[i].style.visibility = "visible";
    };
};
// Click bouton logout -------------------------------------------------------
logoutButton.addEventListener('click', function () {
    if (token) {
        localStorage.removeItem('token')
        document.getElementById("modal__header").style.visibility = "hidden";
        for (let i = 0; i < linkModals.length; i++) {
            linkModals[i].style.visibility = "hidden"
        }
    }
    init();
});
// Click modal -----------------------------------------------------------------

modalLink.addEventListener('click', () => {
    const modal = document.querySelector(".modal");
    modal.style.visibility = "visible";
    const closeIcon = document.querySelector('.close__icon');
    closeIcon.addEventListener('click', () => {
        modal.style.visibility = "hidden";
    });
});
const fileInput = document.getElementById('add__picture');
fileInput.addEventListener('click', () => {
    const modalWrapper = document.querySelector('.modal__wrapper')
    const selectCategorie = document.
        event.preventDefault();
    modalWrapper.innerHTML = `
            <i class="fa-solid fa-arrow-left"></i>
            <i class="fa-solid fa-xmark close__icon"></i>
            <h3 id="title_modal">Ajout photo </h3>
            <div class="add__picture">
            <i class="fa-regular fa-image"></i>
            <form action="#" method="post">
            <input type="file" id="modal__add__picture" value="Ajouter une photo" /> <br>
            <label for="fileInput" id="modal__add__picture">+ Ajouter une photo</label>
            </form>
            <p> jpg, png : 4mo max</p>
            </div>
            <form action="#" method="post">
            <label for="name">Titre</label>
            <input type="text" name="name" id="name" />
            <label for="categories"> Catégorie </label>
            <select id="categories"> name="categories">
            <option value="§{categories.name}">
            </select>



    `;
});

/*
// Récupération de l'image administrateur --------------------------------------
const modalGallery = document.querySelector('.gallery__modal');
console.log(fileInput);

fileInput.addEventListener('change', (e) => {
    const selectFile = e.target.files[0];
    console.log(selectFile);
    const newFile = new FileReader();
    newFile.addEventListener('load', (e) => {
        const addImage = document.createElement('img')
        addImage.src = e.target.result;
        addImage.classList.add('.gallery__modal')
        modalGallery.appendChild(addImage)
    })
    newFile.readAsDataURL(selectFile);
})*/