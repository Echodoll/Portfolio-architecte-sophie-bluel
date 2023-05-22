//----------- Récupération des projets -------------------------
fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then(data => {
        worksData = data;
        console.log(data);
        displayProject();

    });
// récupération des catégories 
fetch("http://localhost:5678/api/categories", {
    Method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
    .then((response) => response.json())
    .then(data => {
        console.log(data);
        const portFolio = document.getElementById("portfolio");
        const buttonDiv = document.createElement('div');
        portFolio.appendChild(buttonDiv)
        const buttonADD = document.createElement('button')
        buttonADD.textContent = "Tous ";
        buttonDiv.appendChild(buttonADD);
        buttonADD.classList.add('button_category');
        buttonDiv.classList.add('button_div')
        data.forEach(categories => {
            const buttonCategory = document.createElement('button');
            buttonCategory.textContent = categories.name;
            buttonDiv.appendChild(buttonCategory);
            buttonCategory.classList.add('button_category');
            buttonCategory.addEventListener('click', () => {

            });
        });
        const secondChild = portFolio.children[1]
        portFolio.insertBefore(buttonDiv, secondChild);
    });

//affichage des projets

function displayProject(project) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    worksData.forEach(project => {

        const figure = document.createElement("figure");
        figure.innerHTML =
            `
                <img src="${project.imageUrl}">
                <figcaption">${project.title}</figcaption>
            `;
        gallery.appendChild(figure)

    });
}