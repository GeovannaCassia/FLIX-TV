function pesquisa(texto) {
    console.log('texto: ', texto);

    fetch(`https://api.themoviedb.org/3/search/tv?api_key=7644214527bf3eb5a617a3505fd2f90a&query=${encodeURIComponent(texto)}&language=pt-BR&page=1`)
        .then(res => res.json())
        .then(data => {
            console.log('Resultado: ', data);
            if (data.results.length == 0) {
                let strP = " ";
                strP += `Não foram encontrados resultados.`
                document.getElementById('resposta').innerHTML = strP;
            }else{
                for (i = 0; i < data.results.length; i++) {
                    let series = data.results[i];
                    const resumoTruncado = truncateText(series.overview, 180);
    
                    const botao = document.createElement('button');
                    botao.textContent = 'Saiba mais';
                    botao.className = 'btn btn-danger w-100';
                    botao.id = `${series.id}`; // Define o ID baseado na série
    
                    let strP = " ";
                    strP += ` <div class="col">
                    <div class="card bg-dark border border-danger text-light h-100">
                    <img src="https://image.tmdb.org/t/p/original/${series.poster_path}" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5 class="card-title">${series.name}</h5>
                    <p class="card-text">Lançamento: ${series.first_air_date}<br>País de origem: ${series.origin_country}<br>${resumoTruncado}</p>
                    </div>
                    <div class="card-footer" id="footer-${series.id}">
                    </div>
                    </div>
                    </div>`;
    
                    document.getElementById('resposta').innerHTML = strP;
    
                    const cardFooter = document.getElementById(`footer-${series.id}`);
                    if (cardFooter) {
                        cardFooter.appendChild(botao);
                    }
    
                    botao.addEventListener('click', () => {
                        console.log(`Botão da série ${botao.id} clicado!`);
                        Detalhes(series.id); // Passa o ID correto para a função Detalhes
                      });
                }
            } 
        })
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

document.getElementById('pesquisar').addEventListener('click', function (event) {
    event.preventDefault();
    const textoPesquisa = document.getElementById('texto').value;
    console.log("Pesquisa: ", textoPesquisa);

    pesquisa(textoPesquisa);
});

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }
  