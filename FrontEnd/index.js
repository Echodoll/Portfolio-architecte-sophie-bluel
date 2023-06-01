
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
            console.log(imageId);
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
    window.location = "./index.html";

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

// click ajout photo ---Création de la deuxiéme modal 

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
        <form action="#" method="post">
        <input class="submit" type="submit" id="valid" value="Valider" />
      </form>
        </div>
        `;
            addPictureInput();
        })
});

function addPictureInput() {
    const addInput = document.querySelector("#modal__add__picture");
    const divAddPicture = document.querySelector(".add__picture")
    const fileInput = divAddPicture.querySelector('input[type=file]');
    const labelInput = divAddPicture.querySelector('label');
    const paragraphInput = divAddPicture.querySelector('p');
    const iconeInput = divAddPicture.querySelector('i');
    const titleInput = document.getElementById('name');
    const categoriesInput = document.getElementById('categories');
    const submitButton = document.getElementById('valid');
    console.log(titleInput);
    console.log(addInput);
    console.log(categoriesInput);
    addInput.addEventListener('change', (e) => {
        const selectFile = e.target.files[0];
        console.log(selectFile);
        const newFile = new FileReader();
        newFile.addEventListener('load', (e) => {
            const addImage = document.createElement('img')
            addImage.src = e.target.result;
            addImage.classList.add('add__img__display');
            divAddPicture.appendChild(addImage);
            fileInput.style.display = 'none';
            labelInput.style.display = 'none';
            paragraphInput.style.display = 'none';
            iconeInput.style.display = 'none';
            divAddPicture.style.flexDirection = 'revert';
            const isImagePresent = divAddPicture.querySelector('img');
            const isTitlePresent = titleInput.value.trim() !== ' ';
            const isCategorySelected = categoriesInput.value !== ' ';

            if (isImagePresent && isTitlePresent && isCategorySelected) {
                submitButton.style.background = '#1D6154'
            }

        });
        newFile.readAsDataURL(selectFile);

    });
};
