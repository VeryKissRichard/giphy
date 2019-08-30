// DOM CLASS elemeket generálni
class Dom {
  constructor() {
    //cél, ahova beillesztjük az elemeket
    this.gifContainer = document.getElementById('gif-container');
    //cél, ahova megy a nincsgif üzenet
    this.nincsGifContainer = document.getElementById('nincsgif');
  }

  //gifek legenerálása
  showGifs(value) {
    let tartalom = '';
    value.forEach(function (gif) {
      tartalom += `
      <div class="col-sm-6 col-md-3 col-xl-2 mb-5">
        <div class="card h-100 ">
          <img src="${gif.images.original.webp}" class="card-img-top img-fluid" alt="...">
          <div class="card-body d-flex flex-column align-items-center justify-content-center">
            <h5 class="card-title">Cím (ha van):</h5>
            <p class="card-text text-center">${gif.title}</p>
            <a href="${gif.url}" class="card-text" target="_blank">Eredeti link</a>
          </div>
        </div>
      </div>
      `;
    });
    //tartalom belerakása a divbe
    this.gifContainer.innerHTML = tartalom;
  }

  // találatok törlése
  clearGifs() {
    this.gifContainer.innerHTML = '';
  }

  //Alert generálás, ha nincs találat
  nincsGif() {
    //törölje a nincsgif üzenetet, ha épp van ilyen
    this.clearNincsGif();
    //adjon classt és üzenete
    this.nincsGifContainer.className = 'alert alert-primary text-center';
    this.nincsGifContainer.innerText = 'Nincs ilyen Gif :(';
    //találatok törlése
    this.clearGifs();
    // 3 mp után törölje az üzenetet
    setTimeout(() => {
      this.clearNincsGif();
    }, 3000);

  }

  //nincsgif üzenet instant törlése
  clearNincsGif() {
    this.nincsGifContainer.className = '';
    this.nincsGifContainer.innerText = '';

  }
}

//GIPHY CLASS api kérésnek
class Giphy {
  constructor() {
    this.apikey = 'FM1YvSRDvnArOnpf9ksSzO9yRhHZan6n';
  }
  //API hívás
  async getGif(value) {
    const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=${value}&api_key=${this.apikey}&limit=24`);

    const gifek = await response.json();
    return gifek
  }
}

//CLASS behívások

const giphy = new Giphy;
const dom = new Dom;

//Eventlistener cél kijelölés
const searchGif = document.getElementById('searchGif');

//Eventlistener kereséshez
searchGif.addEventListener('keyup', (e) => {
  //Keresés input beolvasás
  const searchText = e.target.value;
  //keressen + üresnél tüntesse el az eredményeket
  if (searchText !== '') {
    //API call
    giphy.getGif(searchText)
      .then(data => {
        if (data.data.length === 0) {
          // ha nincs találat, akkor üzenet
          dom.nincsGif();
        } else {
          //megjeleníteni a gifeket
          dom.showGifs(data.data);
          //console.log(data);
        }
      });
  } else {
    //kitörölni a gif-container tartalmat, ha üres a keresőmező
    dom.clearGifs();
  }
});