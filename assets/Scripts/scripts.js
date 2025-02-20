async function fetchGamePass() {
    const response = await fetch(Script_API);
    const games = await response.json();
    const gameContainer = document.getElementById("list-product");
    gameContainer.innerHTML = "";
    games.forEach(game => {
        gameContainer.innerHTML += `
            <a class="col-12 col-lg-6 mb-3" href="#" data-aos="fade-up" data-aos-duration="800" data-aos-offset="0" style="text-decoration: none;">
                <div class="product-category-v1 bg-light">
                    <img class="category-img" src="${game.imageurl}">
                    <div class="view-label d-flex justify-content-center align-items-center p-2 px-4">
                        <h6 class="m-0">ดูรายละเอียด</h6>
                    </div>
                    <h5 id="category-name" class="text-main text-left m-0 ps-3">${game.name}</h5>
                    <div class="row justify-content-center align-items-center m-0 mb-1">
                        <p class="col text-theme text-left m-0" style="font-size: 15px;">ราคา : ${game.price} บาท</p>
                    </div>
                </div>
            </a>
        `;
    });
}

$(document).ready(function() {
    fetchGamePass();
    setInterval(chktoken,2000)
});