const queryString = window.location.search;

const params = new URLSearchParams(queryString);
const data = Object.fromEntries(params.entries());

const API = `http://localhost:3000/favoritos`;

console.log('info: ', data);

let strImg = " ";

strImg += `<img src="https://image.tmdb.org/t/p/original${data.poster_path}" width="90%" height="90%">`;

document.getElementById('cartaz').innerHTML = strImg;

let strInfo = " ";
const botao = document.createElement('button');
botao.textContent = 'Adicionar aos meus favoritos';
botao.className = 'btn btn-danger w-50';
botao.id = `salvafav`; // Define o ID baseado na série

strInfo += `<br><h2 class="text-danger m-auto ">${data.original_name}</h2> 
                <br>
                <div id="botaofav"></div>
                <br>
                <br>
                <h7 class="fw-bold text-white">Lançamento: ${data.last_air_date}</h7>
                <br><h7 class="fw-bold text-white">N° de Temporadas:  ${data.number_of_seasons} - N° de Episodios:  ${data.number_of_episodes}</h7>
                <br><h7 class="fw-bold text-white">Tipo: Internacional - ${data.origin_country}</h7>
                <br><br><h5 class="fst-italic text-white"> ${data.overview}</h5>`;

document.getElementById('info').innerHTML = strInfo;

const cardFooter = document.getElementById(`botaofav`);
if (cardFooter) {
  cardFooter.appendChild(botao);
}

botao.addEventListener('click', () => {
  console.log(`Botão fav clicado!`);
  favoritar();
});

fetch(`https://api.themoviedb.org/3/tv/${data.id}/credits?api_key=7644214527bf3eb5a617a3505fd2f90a&language=pt-BR`)
  .then(res => res.json())
  .then(atores => {
    console.log('Atores:', atores);

    let strE = " ";

    for (i = 0; i < 5; i++) {
      let elenco = atores.cast[i];

      strE += `<div class="col">
              <div class="card h-100 bg-dark border border-danger text-light" style="width: 12rem;">
                <img src="https://image.tmdb.org/t/p/original${elenco.profile_path}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${elenco.original_name}</h5>
                  <p class="card-text text-danger">${elenco.character}</p>
                </div>
              </div>
            </div>`;

      document.getElementById('elenco').innerHTML = strE;
    }
  })

function favoritar() {
  console.log("Botão de favorito clicado!");

  const favorito = {
    titulo: data.original_name,
    lançamento: data.last_air_date,
    origem: data.origin_country,
    resumo: data.overview,
    imagem: data.poster_path,
    id_serie: data.id
  };
  console.log("Dados da serie favorita:", favorito);

  fetch(`${API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(favorito)
  });
  
}
