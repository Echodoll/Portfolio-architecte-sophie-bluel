
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
administrator();
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
    const deletePicture = document.querySelector("#delete")
    const modalGallery = document.querySelector('.gallery__modal');
    works.forEach(project => {
        const figure = document.createElement("figure");
        figure.innerHTML =
            `
        <img  src="${project.imageUrl}" data-id=${project.id}>
        <figcaption>éditer</figcaption>
        `;
        modalGallery.appendChild(figure);
    });
    const modalPicture = modalGallery.querySelectorAll('img');
    modalPicture.forEach(picture => {
        picture.addEventListener('click', () => {
            const imageId = picture.dataset.id;
            picture.classList.toggle('selected');
        });
    });
    deletePicture.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selectedPicture = modalGallery.querySelector(".selected")
        if (selectedPicture) {
            const imageId = selectedPicture.dataset.id
            deleteImage(imageId)
        }
    })
}

function deleteImage(imageId) {
    const token = localStorage.getItem(`token`);
    fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: `DELETE`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('error deleting picture');
            }
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.log("Error delete picture:", error);
        })
    init();
}
//espace administrateur
function administrator() {
    if (token) {
        logoutButton.textContent = "logout";
        document.getElementById("modal__header").style.visibility = "visible";
        document.querySelector("header").style.marginTop = "100px "
        for (let i = 0; i < linkModals.length; i++) {
            linkModals[i].style.visibility = "visible";
        };
        displayModal();
        logoutAdministrator();
    };
}
// Click bouton logout -------------------------------------------------------
function logoutAdministrator() {
    logoutButton.addEventListener('click', function () {
        if (token) {
            localStorage.removeItem('token')
            document.getElementById("modal__header").style.visibility = "hidden";
            for (let i = 0; i < linkModals.length; i++) {
                linkModals[i].style.visibility = "hidden"
            }
        }
        window.location = "./index.html";

    });
}
// Click modal -----------------------------------------------------------------
function displayModal() {
    modalLink.addEventListener('click', () => {
        const modal = document.querySelector(".modal");
        modal.style.visibility = "visible";
        const closeIcon = document.querySelector('.close__icon');
        closeIcon.addEventListener('click', () => {
            modal.style.visibility = "hidden";
        });
        ModalNext();
    });
}

// click ajout photo ---Création de la deuxiéme modal 
function ModalNext() {
    const fileInput = document.getElementById('add__picture');
    fileInput.addEventListener('click', (event) => {
        event.preventDefault();
        const modalWrapper = document.querySelector('.modal__wrapper')
        fetch("http://localhost:5678/api/categories")
            .then((response) => response.json())
            .then(categories => {
                modalWrapper.innerHTML = `
    
        <i class="fa-solid fa-arrow-left"></i>
        <i class="fa-solid fa-xmark close__icon"></i>
        <div class=add__global>
        <h3 id="title_modal">Ajout photo </h3>
        <div class="add__picture">
        <i class="fa-regular fa-image"></i>
        <form action="#" method="post">
        <input type="file" id="modal__add__picture" value="Ajouter une photo" /> <br>
        <label for="modal__add__picture" id="modal__add__picture">+ Ajouter une photo</label>
        </form>
        <p> jpg, png : 4mo max</p>
        </div>
        <div id="modal__title__categorie">
        <form action="#" method="post">
        <label for="name">Titre</label>
        <input type="text" name="name" id="name" />
        <label for="categories"> Catégorie </label>
        <select id="categories" name="categories">
        <option value= " " > </option>
        ${categories.map(category => `<option value="${category.id}">${category.name}</option>`)}
        </select>
        </form>
        </div>
        <form action="#" class="form__valid" method="post">
        <input  type="submit" id="valid" value="Valider" />
      </form>
        </div>
        `;


                addPictureInput();

            })

    });

}
let valueCategories;
let valueTitle;
let addImageValue;
function addPictureInput() {
    const addInput = document.querySelector("#modal__add__picture");
    const divAddPicture = document.querySelector(".add__picture")
    const titleInput = document.querySelector("#name");
    const categoriesInput = document.querySelector("#categories");
    categoriesInput.addEventListener('input', () => {
        console.log(categoriesInput.value)
        valueCategories = categoriesInput.value;
        handleCategoriesValue(valueCategories)
    })
    titleInput.addEventListener('input', () => {
        console.log(titleInput.value)
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
    return value
};
function handlePictureValue(files) {
    console.log(files);
    return files;
}

function fetchLoadWorks() {
    const submit = document.querySelector(".form__valid");
    submit.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData()
        const pictureValue = handlePictureValue(addImageValue)
        formData.append("image", pictureValue);
        const titleValue = handleTitleValue(valueTitle)
        formData.append("title", titleValue)
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
        fetch("http://localhost:5678/api/works", request)
            .then(response => {
                if (response.ok) {
                } else {
                };
            });
    });
};
