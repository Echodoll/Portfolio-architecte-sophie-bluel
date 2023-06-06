
const logoutButton = document.getElementById('logout');
const token = localStorage.getItem('token');
let worksData; // stockage des données (projets)
let categoriesData; // stockage des categories
const portFolio = document.getElementById("portfolio");
const linkEdit = document.querySelector('.link__modal__portfolio')


//----------- Récupération des API -------------------------
function fetchCategory() {

    return fetch("http://localhost:5678/api/categories")
        .then((response) => response.json())
        .then(categories => {
            categoriesData = categories;
            return categories;
        })
};
function fetchWorks() {
    return fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then(works => {
            worksData = works;
            return works;
        });
}
// --- fonction asynchrome afin d'attendre la récupération des données

async function fetchData() {
    const works = await fetchWorks();
    const categories = await fetchCategory();
    displayProjectAndCategories(categories, works);
}
fetchData();

//------------------------------- Affichage des catégories et projets ---------------------------------------------------------------------------
//-------------------------------------------------------------------
logoutButton.addEventListener("click", () => {
    if (logoutButton.textContent === 'login') {
        window.location.href = './login.html'
    } else if (logoutButton.textContent === 'logout') {
        window.location.href = './index.html'

    }
})
function displayProjectAndCategories() {
    const buttonDiv = document.createElement('div');
    portFolio.appendChild(buttonDiv)
    const buttonADD = document.createElement('button')
    buttonADD.textContent = "Tous ";
    buttonADD.addEventListener('click', () => {
        displayWorks();
    });
    buttonADD.classList.add('button_category');
    buttonDiv.classList.add('button_div')
    buttonDiv.appendChild(buttonADD);
    categoriesData.forEach(category => {
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
    displayWorks();
};
if (token) {
    administrator();
    logoutAdministrator();
    headbandBlack();
}
//**********/ Fonction qui comprend l'affichage des images **********

function displayWorks() {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    if (worksData) {
        worksData.forEach(project => {
            const figure = document.createElement("figure");
            figure.innerHTML =
                `
                <img src="${project.imageUrl}">
                <figcaption">${project.title}</figcaption>
            `;
            gallery.appendChild(figure)
        });
    };
};

function administrator() {
    if (token) {
        logoutButton.textContent = "logout";
        document.querySelector("header").style.marginTop = "100px ";
        const linkModals = document.getElementsByClassName("link__modal")
        for (let i = 0; i < linkModals.length; i++) {
            linkModals[i].style.visibility = "visible";
        };

        // const buttonCategory = document.querySelector('.button_div');
        //displayModal();
    } else {
    }
};

linkEdit.addEventListener('click', () => {
    displayModalsGallery();
});

function headbandBlack() {
    const header = document.querySelector("header");
    const displayHeadband = document.createElement("div");
    header.appendChild(displayHeadband);
    displayHeadband.innerHTML = `
    <aside
      id="modal__header"
      class="modal__header js-modal"
      aria-hidden="true"
      role="dialog"
      aria-modal="false"
      aria-labelledby="title_modal"
    >
      <div  class="modal__header__display">
        <p> <i class="fa-regular fa-pen-to-square"></i> Mode édition </p>
        <p class="modal__header__publish"> publier les changements </p>
      </div>
    </aside>
    `;
};
// Fonction affichage de la modal----------------
function displayModalsGallery() {
    const modalGallery = document.createElement('div');
    portFolio.appendChild(modalGallery);
    modalGallery.classList.add('portfolio__link__modal')
    let modalContent = `
        <aside id="modal" class="modal js-modal" aria-hidden="true" role="dialog" aria-modal="false" aria-labelledby="title_modal">
            <div class="modal__wrapper">
                <i class="fa-solid fa-xmark close__icon"></i>
                <h3 id="title_modal">Galerie Photos</h3>
                <div class="gallery__modal">
    `;

    worksData.forEach(project => {
        const figure = document.createElement("figure");
        figure.innerHTML =
            `
            <figure>
            <img  src="${project.imageUrl}" data-id=${project.id}>
            <figcaption>éditer</figcaption>
            </figure>
            `;
        modalContent += figure.innerHTML;
    });
    modalContent += `
                </div>
                <div id="contact">
                    <form action="#" method="post">
                        <input type="submit" id="add__picture" value="Ajouter une photo" />
                    </form>
                    <span id="delete" class="error"> Supprimer la photo</span>
                </div>
            </div>
        </aside>
    `;
    modalGallery.insertAdjacentHTML('beforeend', modalContent);
    const portFolioContainer = document.getElementById('portfolio');
    portFolioContainer.appendChild(modalGallery);
    const closeIcon = document.querySelector('.close__icon');
    closeIcon.addEventListener('click', () => {
        modalGallery.innerHTML = "";
    });
    deletePicture();
    ModalNext();
};

// fonction pour supprimer une photos --------------------------------------------------------------------------
function deletePicture() {
    const deletePicture = document.querySelector("#delete")
    const modalPicture = document.querySelectorAll('img');
    modalPicture.forEach(picture => {
        picture.addEventListener('click', () => {
            picture.classList.toggle('selected');
        });
        deletePicture.addEventListener('click', (e) => {
            const selectedPicture = document.querySelector(".selected")
            if (selectedPicture) {
                const imageId = selectedPicture.dataset.id
                fetchDelete(imageId)
            }
        })
    });
}
// fonction pour la requête delete API  --------------------------------------------------------------------------
function fetchDelete(imageId) {
    const token = localStorage.getItem(`token`);
    fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: `DELETE`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                console.log("image supprimée avec succée ");
                fetchWorks();
            } else {
                console.log('error deleting picture');
            };
        });
};
//espace administrateur

// Click bouton logout -------------------------------------------------------
function logoutAdministrator() {
    logoutButton.addEventListener('click', function () {
        if (token) {
            localStorage.removeItem('token')
            document.getElementById("modal__header").style.visibility = "hidden";
            for (let i = 0; i < linkModals.length; i++) {
                linkModals[i].style.visibility = "hidden"
            }
            window.location = "./index.html";
        }
    });
}
// click ajout photo ---Création de la deuxiéme modal 
function ModalNext() {
    const fileInput = document.getElementById('add__picture');

    fileInput.addEventListener('click', (event) => {
        event.preventDefault();
        const modalWrapper = document.querySelector('.modal__wrapper');
        fetch("http://localhost:5678/api/categories")
            .then((response) => response.json())
            .then(categories => {
                modalWrapper.innerHTML = `
    
        <i class="fa-solid fa-arrow-left"></i>
        <i class="fa-solid fa-xmark close__icon"></i>
        <div class=add__global>
        <h3 id="title_modal">Ajout photo </h3>
        <div class="add__picture">
        <i class="fa-regular fa-image previous__icone"></i>
        <form action="#" method="post">
        <input type="file" id="modal__add__picture" value="Ajouter une photo" /> <br>
        <label for="modal__add__picture" id="modal__add__picture">+ Ajouter une photo</label>
        </form>
        <span class="error error__picture"id="error__input"> </span>
        <p> jpg, png : 4mo max</p>
        </div>
        <div id="modal__title__categorie">
        <form action="#" method="post">
        <label for="name">Titre</label>
        <input type="text" name="name" id="name" />
        <span class="error error__input" id="error__input"> </span>
        <label for="categories"> Catégorie </label>
        <select id="categories" name="categories">
        <option value= " " class="option__category" > </option>
        ${categories.map(category => `<option value="${category.id}">${category.name}</option>`)}
        </select>
        <span class="error error__category"id="error__input"> </span>
        </form>
        </div>
        <form action="#" class="form__valid" method="post">
        <input  type="submit" id="valid" value="Valider" />
      </form>
        </div>
        `;
                const closeIcon = document.querySelector('.close__icon');
                const contenairModal = document.querySelector('.portfolio__link__modal');
                closeIcon.addEventListener('click', () => {
                    contenairModal.innerHTML = "";
                });
                const previousIcone = document.querySelector('.previous__icone');
                previousIcone.addEventListener('click', () => {
                    displayModal();
                })
                addPictureInput();
            });
    });
};
let valueCategories;
let valueTitle;
let addImageValue;
function addPictureInput() {
    const addInput = document.querySelector("#modal__add__picture");
    const divAddPicture = document.querySelector(".add__picture")
    const titleInput = document.querySelector("#name");
    const categoriesInput = document.querySelector("#categories");
    categoriesInput.addEventListener('input', () => {
        console.log(categoriesInput.value);
        valueCategories = categoriesInput.value;
        handleCategoriesValue(valueCategories);
    })
    titleInput.addEventListener('input', () => {
        console.log(titleInput.value);
        valueTitle = titleInput.value;
        handleTitleValue(valueTitle);
    })
    console.log(addInput, divAddPicture, titleInput, categoriesInput.value)
    addInput.addEventListener('change', (e) => {
        const selectFile = e.target.files[0];
        const newFile = new FileReader();
        addImageValue = e.target.files[0];
        handlePictureValue(addImageValue);
        console.log(addImageValue);
        newFile.addEventListener('load', (e) => {
            const addImage = document.createElement('img')
            addImage.src = e.target.result;
            addImage.classList.add('add__img__display');
            divAddPicture.querySelectorAll('*').forEach(child => {
                child.style.display = 'none';
            });
            divAddPicture.appendChild(addImage);
            divAddPicture.style.flexDirection = 'revert';

        });
        newFile.readAsDataURL(selectFile);

    });

    fetchLoadWorks();
};
function handleCategoriesValue(value) {
    console.log(value);
    return value;
};
function handleTitleValue(value) {
    console.log(value);
    return value;
};
function handlePictureValue(files) {
    console.log(files);
    return files;
};

function fetchLoadWorks() {
    const submit = document.querySelector(".form__valid");
    const errorCategory = document.querySelector('.error__category');
    const errorTitle = document.querySelector(".error__input");
    const errorPicture = document.querySelector(".error__picture");
    const buttonSubmit = document.getElementById("valid")

    submit.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData()
        const pictureValue = handlePictureValue(addImageValue);
        formData.append("image", pictureValue);
        const titleValue = handleTitleValue(valueTitle);
        formData.append("title", titleValue);
        const categoriesValue = handleCategoriesValue(valueCategories);
        formData.append("category", categoriesValue);
        const token = localStorage.getItem(`token`);

        let request = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        };

        if (pictureValue == null) {
            errorPicture.textContent = "Veuillez insérer une photo";
            submit.disabled = true;
            buttonSubmit.style.background = "";

        } else if (titleValue == null) {
            errorTitle.textContent = "Veuillez écrire un titre";
            submit.disabled = true;
            buttonSubmit.style.background = "";
        } else if (categoriesValue == null) {
            errorCategory.textContent = "Veuillez séléctionner une catégorie";
            submit.disabled = true;
            buttonSubmit.style.background = "";
        } else {
            submit.disabled = false;
            fetch("http://localhost:5678/api/works", request)
                .then(response => {
                    if (response.ok) {
                        console.log("Image mise à jour avec succés");
                        return fetchWorks();
                    } else {
                        console.log("Erreur lors de la mise à jour de l'image ");
                    };
                })
                .then(updateWorks => {
                    worksData = updateWorks;
                    displayWorks();
                })
        };
    });
}


// Mon logout au click qui envoi sur la page login 

// impossible d'enlever les catégories en mode administrateur

// mon bouton qui devient vert au click 

// previous ? comment gérer ça ?

// quand je clique sur la croix et que j'appuie de nouveau sur modifier, la modal se rouvre ou j'étais
