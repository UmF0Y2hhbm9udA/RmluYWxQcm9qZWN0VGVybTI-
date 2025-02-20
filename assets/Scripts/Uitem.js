async function fetchGamePass() {
    const response = await fetch(UI_API);
    const games = await response.json();
    const gameContainer = document.getElementById("list-product");
    gameContainer.innerHTML = "";
    games.forEach(game => {
        gameContainer.innerHTML += `
            <a class="product-item-md product-filter" href="#" style="text-decoration: none;">
                <div class="product-v2 bg-light">
                    <div class="product-img ">
                        <img src="${game.imageurl}">
                    </div>
                    <div class="px-2 m-0">
                        <h4 class="product-name text-theme text-left mb-0 mt-2 ">${game.name}</h4>
                        <div class="d-flex justify-content-between align-items-end mb-2">
                            <p class="product-price text-main text-center m-0 ">
                                ${game.price} บาท
                            </p>
                            <div class="btn btn-main text-center py-1" style="border-radius: 10px;">Purchase</div>
                        </div>
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