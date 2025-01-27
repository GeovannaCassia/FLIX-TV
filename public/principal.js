const API = `http://localhost:3000/autoria`;
const APIFAV = `http://localhost:3000/favoritos`;
const API_KEY = '7644214527bf3eb5a617a3505fd2f90a';
let id;

//Requisição para o carrossel
fetch('https://api.themoviedb.org/3/tv/popular?api_key=7644214527bf3eb5a617a3505fd2f90a&language=pt-BR&page=1&sort_by=vote_average.desc&vote_count.gte=200')
  .then(res => res.json())
  .then(data => {
    console.log('Carrosel', data);
    let str = '';
    console.log('data.results.length: ', data.results.length);
    for (let i = 13; i < 16; i++) {
      let series = data.results[i];
      
      console.log('Carrosel: ', series);
      str += `    <div class="carousel-item active ativo" id=carrossel-${series.id}>
                      <img src="https://image.tmdb.org/t/p/original${series.backdrop_path}" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
                          <h5 class="fw-bold">${series.name} - ${series.name}</h5>
                          <p>${series.overview}</p>
                        </div>
                      </div>`
    }
    document.getElementById('banner').innerHTML = str;

    for (let i = 13; i < 16; i++) {
      let series = data.results[i];
      const id = series.id; // Define o ID da série
      document.getElementById(`carrossel-${id}`).addEventListener('click', () => {
          console.log(`Carrossel da série ${id} clicado`);
          Detalhes(id); // Passa o ID correto para a função Detalhes
      });
    }
  })

//Requisição para novas series
fetch('https://api.themoviedb.org/3/tv/popular?api_key=7644214527bf3eb5a617a3505fd2f90a&language=pt-BR&page=1')
  .then(res => res.json())
  .then(data => {
    console.log('Novas Series', data);
    let strN = '';
    let count = 0;
    let count1 = 0;
    console.log('data.results.length: ', data.results.length);

    for (let i = 0; i < data.results.length && count < 4; i++) {
      let series = data.results[i];

      console.log('Series: ', series);
      if (series.overview && series.overview.trim() !== "") {
        const resumoTruncado = truncateText(series.overview, 180);
        strN += `    <div class="col">
            <div class="card bg-dark border border-danger text-light h-100">
              <img src="https://image.tmdb.org/t/p/original${series.poster_path}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${series.name}</h5>
                <p class="card-text">Lançamento: ${series.first_air_date}<br>País de origem: ${series.origin_country}
                <br>${resumoTruncado}</p>
              </div>
              <div class="card-footer" id="footer-${series.id}">
                
              </div>
            </div>
          </div>`;

        document.getElementById('NewSeries').innerHTML = strN;
        count++;
      }
    }
    for (let i = 0; i < data.results.length && count1 < 4; i++) {

      let series = data.results[i];
      if (series.overview && series.overview.trim() !== "") {
        const botao = document.createElement('button');
        botao.textContent = 'Saiba mais';
        botao.className = 'btn btn-danger w-100';
        botao.id = `${series.id}`; // Define o ID baseado na série

        // Seleciona o card-footer correto e insere o botão
        const cardFooter = document.getElementById(`footer-${series.id}`);
        if (cardFooter) {
          cardFooter.appendChild(botao);
        }
        count1++;
        // Adiciona o evento de clique no botão
        botao.addEventListener('click', () => {
          console.log(`Botão da série ${botao.id} clicado!`);
          Detalhes(series.id); // Passa o ID correto para a função Detalhes
        });

      }
    }
  })
//Requisição ao db.json para mostrar informações do autor
fetch(`${API}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(autoria => {
    console.log("Autoria", autoria);
    const telaA = document.getElementById('minhas-informaçoes');
    telaA.innerHTML = '';
    const texto = document.createElement(`div`);
    texto.classList.add('row');

    texto.innerHTML += `
                    <div class="col-md-7">
                    <div class="p-3  text-white">
                        <h5 class="text-danger">Sobre mim</h5>
                        ${autoria[0].minibio}
                    </div>
                  </div>
                  
                  <div class="col-md-5">
                    <div class="p-3 text-white d-flex align-items-center"> 
                        <img class= "rounded-circle" src="assets/images/Imagens/geovanna.png" alt="" width="180" height="200">
                        <div class="p-3">
                        <h5 class="text-danger">Autoria</h5>
                        <h7 class="fw-bolder">Aluno: ${autoria[0].aluno}</h7> 
                        <br><h7 class="fw-bold">Curso: ${autoria[0].curso}</h7>
                        <br><h7 class="fw-bold">Turma: ${autoria[0].turma}</h7>
                        <h5 class="text-danger">Redes sociais: </h5><i class="fa-brands fa-facebook" style="color: #ffffff;"></i> <i class="fa-brands fa-twitter"></i> <i class="fa-brands fa-instagram"></i>
                        </div>
                        
                    </div>
                  </div>`;

    telaA.appendChild(texto);
  })
  .catch(error => {
    console.error('Erro ao obter texto de autoria via API JSONServer:', error);
    displayMessage("Erro ao obter texto de autoria");
  });

//Requisição ao db.json para mostrar series favoritas
fetch(`${APIFAV}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(favoritos => {
    console.log('Series favoritas: ', favoritos);
    let strF = '';

    console.log('favoritos.length: ', favoritos.length);

    for (let i = 0; i < favoritos.length; i++) {
      let series = favoritos[i];
      const resumoTruncado = truncateText(series.resumo, 180);
      console.log('Serie: ', series);

      strF += `<div class="col">
            <div class="card bg-dark border border-danger text-light h-100">
              <img src="https://image.tmdb.org/t/p/original${series.imagem}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${series.titulo}</h5>
                <p class="card-text">Lançamento: ${series.lançamento}<br>País de origem: ${series.origem}<br>${resumoTruncado}</p>
              </div>
              <div class="card-footer" id="footer2-${series.id_serie}">
                
              </div>
            </div>
          </div>`;


      document.getElementById('Seriesfav').innerHTML = strF;

    }
    for (let i = 0; i < favoritos.length; i++) {

      let series = favoritos[i];
      console.log('SerieB: ', series);
      const botao = document.createElement('button');
      botao.textContent = 'Saiba mais';
      botao.className = 'btn btn-danger w-100';
      botao.id = `${series.id_serie}`; // Define o ID baseado na série

      // Seleciona o card-footer correto e insere o botão
      const cardFooter = document.getElementById(`footer2-${series.id_serie}`);
      if (cardFooter) {
        cardFooter.appendChild(botao);
      }
      // Adiciona o evento de clique no botão
      botao.addEventListener('click', () => {
        console.log(`Botão da série ${botao.id_serie} clicado!`);
        Detalhes(series.id_serie); // Passa o ID correto para a função Detalhes
      });
    }
  });

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}


function Detalhes(id) {
  console.log('ID:', id);
  fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=7644214527bf3eb5a617a3505fd2f90a&language=pt-BR`)
    .then(res => res.json())
    .then(data => {
      console.log('Info: ', data)
      const queryString = new URLSearchParams(data).toString();
      window.location.href = `detalhes.html?${queryString}`;
    })
}

