
const logoutButton = document.getElementById('logout');
const token = localStorage.getItem('token');
let worksData; // stockage des données (projets)
let categoriesData; // stockage des categories
const portFolio = document.getElementById("portfolio");
const linkEdit = document.querySelector('.link__modal__portfolio');

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
    worksData = works
    const categories = await fetchCategory();
    displayProjectAndCategories(categories, works);
};

//-------- Fonction refresh pour synchroniser les images supprimés
function refreshWorks() {
    fetchWorks()
        .then(works => {
            worksData = works;
            displayWorks();
        })
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
        displayWorks(worksData);
    });
    buttonADD.classList.add('button_category');
    buttonDiv.classList.add('button_div')
    buttonDiv.appendChild(buttonADD);
    categoriesData.forEach(category => {
        const buttonCategory = document.createElement('button');
        buttonCategory.textContent = category.name;
        buttonCategory.classList.add('button_category');
        buttonDiv.appendChild(buttonCategory);
        buttonCategory.addEventListener('click', () => {
            const categoryName = buttonCategory.textContent;
            const gallery = document.querySelector('.gallery');
            const filterWorks = worksData.filter(work => {
                return work.category.name === categoryName
            });
            gallery.innerHTML = '';
            filterWorks.forEach(project => {
                const figure = document.createElement("figure");
                figure.innerHTML =
                    `
                    <img src="${project.imageUrl}">
                    <figcaption>${project.title}</figcaption>
                    `;
                gallery.appendChild(figure)
            });
            console.log(filterWorks)
        });
        displayWorks()
    });
    const secondChild = portFolio.children[1];
    portFolio.insertBefore(buttonDiv, secondChild);
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
    worksData.forEach(project => {
        const figure = document.createElement("figure");
        figure.innerHTML =
            `
                <img src="${project.imageUrl}">
                <figcaption>${project.title}</figcaption>
            `;
        gallery.appendChild(figure)
    });
};
function administrator() {
    if (token) {
        logoutButton.textContent = "logout";
        document.querySelector("header").style.marginTop = "100px ";
        const linkModals = document.getElementsByClassName("link__modal")
        for (let i = 0; i < linkModals.length; i++) {
            linkModals[i].style.visibility = "visible";
        };
    } else {

    }
};
linkEdit.addEventListener('click', (event) => {
    displayModalsGallery();
    event.stopPropagation();
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
    const body = document.querySelector('body')

    modalGallery = document.createElement('div');
    modalGallery.classList.add('portfolio__link__modal');
    modalGallery.classList.add('modal__close');
    modalGallery.style.display = "block";

    let modalContent = `
        <aside id="modal" class="modal js-modal" aria-hidden="true" role="dialog" aria-modal="false" aria-labelledby="title_modal">
            <div class="modal__wrapper">
                <i class="fa-solid fa-xmark close__icon"></i>
                <h3 id="title_modal">Galerie Photos</h3>
                <div class="gallery__modal" id="galleryModal">
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

    body.addEventListener('click', CloseModalClick)
    modalGallery.insertAdjacentHTML('beforeend', modalContent);
    const portFolioContainer = document.getElementById('portfolio');
    portFolioContainer.appendChild(modalGallery);
    const AddPictureInput = document.getElementById('add__picture');
    AddPictureInput.addEventListener('click', () => {
        event.stopPropagation()
        ModalNext()
    })
    console.log(body)
    deletePicture();
    closeModal();
};
function removeModale() {
    modalGallery.remove()
    document.body.removeEventListener('click', CloseModalClick)

}
function CloseModalClick(event) {
    const modalWrapper = document.querySelector('.modal__wrapper');
    document.querySelector('.modal__wrapper');
    if (modalWrapper.contains(event.target) === false) {
        handleCloseModale();
    };
};
function handleCloseModale() {
    document.body.removeEventListener('click', CloseModalClick)
    modalGallery.remove();
}
function closeModal() {
    const close = document.querySelector('.close__icon');

    close.addEventListener('click', handleCloseModale)
};
// fonction pour supprimer une photos --------------------------------------------------------------------------
function deletePicture() {
    const deleteButton = document.querySelector("#delete");
    const modalPictures = document.querySelectorAll('img');
    modalPictures.forEach(picture => {
        picture.addEventListener('click', () => {
            picture.classList.toggle('selected');
        });
    });
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        const selectedPicture = document.querySelector(".selected");

        if (selectedPicture) {
            const imageId = selectedPicture.dataset.id;
            fetchDelete(imageId)
                .then(() => {
                    selectedPicture.parentNode.remove();
                    refreshWorks();
                });
        };
    });
};
// fonction pour la requête delete API  --------------------------------------------------------------------------
async function fetchDelete(imageId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
            console.log('Image supprimée avec succès');
        } else {
            throw new Error('Erreur lors de la suppression de l\'image');
        };
    } catch (error) {
        console.log(error);
    }
}
// Click bouton logout -------------------------------------------------------
function logoutAdministrator() {
    logoutButton.addEventListener('click', function () {
        if (token) {
            localStorage.removeItem('token')
            document.getElementById("modal__header").style.visibility = "hidden";
            for (let i = 0; i < linkModals.length; i++) {
                linkModals[i].style.visibility = "hidden"
            };
            window.location = "./index.html";
        };
    });
};
// click ajout photo --------------Création de la deuxiéme modal ------------------------------------------------------
function ModalNext() {
    const modalWrapper = document.querySelector('.modal__wrapper');
    modalGallery.style.display = "block";
    modalWrapper.innerHTML =
        modalWrapper.innerHTML = `
            <i class="fa-solid fa-arrow-left"id="open__modal__previous"></i>
            <i class="fa-solid fa-xmark close__icon"></i>
            <div class=add__global>
            <h3 id="title_modal">Ajout photo </h3>
            <div class="add__picture">
            <i class="fa-regular fa-image previous__icone" ></i>
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
            ${categoriesData.map(category => `<option value="${category.id}">${category.name}</option>`)}
            </select>
            <span class="error error__category"id="error__input"> </span>
            </form>
            </div>
            <form action="#" class="form__valid" method="post">
            <input  type="submit" id="valid" value="Valider" />
          </form>
            `;
    addPictureInput();
    closeModal();
    const previous = document.getElementById("open__modal__previous")
    previous.addEventListener('click', (event) => {
        event.stopPropagation();
        handleCloseModale();
        displayModalsGallery();
    })
}
// ------ stockage des valeurs ----------------------------------------------
let valueCategories;
let valueTitle;
let addImageValue;
//----------------------------------------------------------------------------

function addPictureInput() {
    const addInput = document.querySelector("#modal__add__picture");
    const divAddPicture = document.querySelector(".add__picture")
    const titleInput = document.querySelector("#name");
    const categoriesInput = document.querySelector("#categories");
    categoriesInput.addEventListener('input', () => {
        valueCategories = categoriesInput.value;
        console.log(valueCategories)
        checker();
    })
    titleInput.addEventListener('input', () => {
        valueTitle = titleInput.value;
        console.log(valueTitle)
        checker();
    })
    addInput.addEventListener('change', (e) => {
        const selectFile = e.target.files[0];
        const newFile = new FileReader();
        addImageValue = e.target.files[0];
        newFile.addEventListener('load', (e) => {
            const addImage = document.createElement('img')
            addImage.src = e.target.result;
            addImage.classList.add('add__img__display');
            divAddPicture.querySelectorAll('*').forEach(child => {
                child.style.display = 'none';
            });
            divAddPicture.appendChild(addImage);
            divAddPicture.style.flexDirection = 'revert';
            checker();
        });
        newFile.readAsDataURL(selectFile);
    });
    fetchLoadWorks()
}
//---- Fetch Request ajout photos -------------------------------------------------------------------------------------
function fetchLoadWorks() {
    const submit = document.querySelector(".form__valid");
    const token = localStorage.getItem(`token`);

    submit.addEventListener('submit', (event) => {

        const formData = new FormData()
        formData.append("image", addImageValue);
        formData.append("title", valueTitle);
        formData.append("category", valueCategories);
        event.preventDefault();
        let request = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        };
        fetch("http://localhost:5678/api/works", request)
            .then(response => {
                if (response.ok) {
                    reinit();
                    alert(`Votre projet ` + valueTitle + ` est en ligne`)
                    addPictureInput()
                    return fetchWorks();
                } else {
                    alert('Veuillez remplir les formulaires ')
                    console.log("Erreur lors de la mise à jour de l'image ");
                };
            })
            .then(updateWorks => {
                if (updateWorks) {
                    worksData = updateWorks;
                    displayWorks();
                }
            })
    });
};
function reinit() {
    const reinitPicture = document.querySelector('.add__img__display');
    const titleInput = document.querySelector("#name");
    const categoriesInput = document.querySelector("#categories");
    const divAddPicture = document.querySelector(".add__picture");
    const submit = document.querySelector(".form__valid");
    const submitButton = document.getElementById('valid');
    reinitPicture.src = "";
    titleInput.value = "";
    categoriesInput.value = "";
    submit.disabled = true;
    submitButton.style.background = "#A7A7A7";
    divAddPicture.querySelectorAll('*').forEach(child => {
        child.style.display = 'flex'
    });
    divAddPicture.style.flexDirection = "column";
    addPictureInput()
};

function checker() {
    const submitButton = document.getElementById('valid');
    const submit = document.querySelector(".form__valid");
    if (addImageValue !== undefined && valueTitle !== undefined && valueCategories !== undefined) {
        submitButton.style.background = "#1D6154";
        submit.disabled = false;
    } else {
        submitButton.style.background = "#A7A7A7";
        submit.disabled = true;
    };
};

