import { menuArray } from '/data.js';

let orderList = [];

const orderEl = document.getElementById('order');

document.addEventListener('click', function (e) {
    e.target.dataset.addFood ? handleFoodBtnClick(e.target.dataset.addFood)
        : e.target.dataset.removeBtn ? handleRemoveBtnClick(e.target.dataset.removeBtn)
            : e.target.id === "complete-order" ? handleCompleteOrderClick()
                : ''
});

function handleFoodBtnClick(id) {
    let buttonId = Number(id);
    let orderItem = {};

    const foodItem = menuArray.find((food) => food.id === buttonId ? food : "");

    if (orderList.length < 1) {
        orderItem = {
            name: foodItem.name,
            price: foodItem.price,
            amount: 1,
            id: foodItem.id,
        };
        orderList.push(orderItem);
    } else {
        const existingOrderItem = orderList.find((item) => item.name === foodItem.name);
        if (existingOrderItem) {
            existingOrderItem.amount++;
        } else {
            orderItem = {
                name: foodItem.name,
                price: foodItem.price,
                amount: 1,
                id: foodItem.id,
            };
            orderList.push(orderItem);
        }
    }

    orderEl.innerHTML = renderOrder(orderList);
    renderInsertBefore(orderEl);
    handleTotalPrice(orderList);

};

function renderOrder(orderArr) {
    let orderHtml = ``;

    return orderArr.map((food) => {
        const { name, price, amount, id } = food;
        const fullPrice = price * amount;

        return orderHtml =
            `
        <div id="${id}" class="f-center">
            <h2>${name} x${amount}</h2>
            <button class="remove-btn" data-remove-btn="${id}">remove</button>
            <p class="ml-auto">$${fullPrice}</p>
        </div>
        `
    }).join('');
};

function renderInsertBefore(orderEl) {
    const yourOrderEl = document.createElement("h2");
    yourOrderEl.classList.add("t-center")
    yourOrderEl.textContent = "Your order";

    return orderEl.insertBefore(yourOrderEl, orderEl.firstChild);
};

function handleTotalPrice(orderList) {
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("order-summary");

    const totalPrice = orderList.reduce((acc, item) => acc + (item.price * item.amount), 0);

    totalPrice === 0 ? orderEl.classList.add("hidden") : orderEl.classList.remove("hidden");

    totalDiv.innerHTML =
        `
        <div class="f-center">
            <h2>Total price:</h2>
            <p class="ml-auto">$${totalPrice}</p> 
        </div>
        <button id="complete-order" class="complete-order">Complete order</button>
        `

    return orderEl.append(totalDiv);
}

function handleRemoveBtnClick(elementIdToRemove) {
    const idToRemove = Number(elementIdToRemove)

    const valueToReduce = orderList.find((item) => item.id === idToRemove);

    if (valueToReduce.amount > 1) {
        valueToReduce.amount--;
    } else {
        orderList = orderList.filter((item) => item.id !== idToRemove)
    }

    orderEl.innerHTML = renderOrder(orderList);
    renderInsertBefore(orderEl);
    handleTotalPrice(orderList);
};

function handleCompleteOrderClick() {
    const modal = document.createElement("div");
    modal.classList.add("modal")

    modal.innerHTML =
        `
         <div class="modal-main">
            <h2 class="card-header">Enter card details</h2>
            <form id="card-forms">
                <input id="client-name" type="text" placeholder="Enter your name" required>
                <input type="number" placeholder="Enter card number" required>
                <input type="number" placeholder="Enter CVV" required>
                <button class="complete-order" type="submit">Pay</button> 
            </form>
            
        </div>
        `

    orderEl.append(modal);

    const cardFormsEl = document.getElementById("card-forms");
    cardFormsEl.addEventListener('submit', function (e) {
        e.preventDefault();
        modal.classList.add("hidden");
        handlePayClick(e);
    });
};

function handlePayClick(e) {
    e.preventDefault();

    const clientName = document.getElementById("client-name");

    let nameValue = clientName.value;

    const finishedWindow = document.createElement("div")
    finishedWindow.classList.add("final-window")
    finishedWindow.innerHTML = `<h1>Thanks, ${nameValue}! Your order is on it's way!</h1>`

    orderEl.innerHTML = "";
    orderList = [];
    orderEl.append(finishedWindow);
};

function renderMenu(menuArray) {
    let feedHtml = ``;

    return menuArray.map((position) => {
        const { name, ingredients, price, emoji, id } = position;

        feedHtml =
            `
            <div class="food-position">
                <span class="food-icon">${emoji}</span>
                <div class="food-description">
                    <h2 class="m-auto">${name}</h2>
                    <p class="food-ingredients">${ingredients.join(', ')}</p>
                    <p class="m-auto">$${price}</p>
                </div>
                <button class="add-food-btn ml-auto" data-add-food="${id}">+</button>
            </div>
        `
    }).join('');
};

document.getElementById('menu').innerHTML = renderMenu(menuArray);
