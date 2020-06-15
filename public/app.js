// import { get } from "mongoose";
// function myFunction(elem){
//   console.log(elem);
// }

const toDate = (date) => {
  return new Intl.DateTimeFormat("ua-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});

const toCurrency = (price) => {
  return new Intl.NumberFormat("ua-UA", {
    currency: "uah",
    style: "currency",
  }).format(price);
};

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const $basket = document.querySelector("#basket");

if ($basket) {
  $basket.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;

      fetch("/basket/remove/" + id, {
        method: "delete",
        headers: {
          "X-XSRF-TOKEN": csrf,
        },
      })
        .then((res) => res.json())
        .then((basket) => {
          if (basket.pharmacy.length) {
            const html = basket.pharmacy
              .map((c) => {
                return `<tr>
                <td>${c.title}</td>
                <td>${c.count}</td>
                <td><button class="btn btn-small js-remove" data-id='${c.id}' data-csrf="${csrf}">Видалити</button></td>
            </tr>`;
              })
              .join("");
            $basket.querySelector("tbody").innerHTML = html;
            $basket.querySelector(".price").textContent = toCurrency(
              basket.price
            );
          } else {
            $basket.innerHTML = "<p>Кошик порожній</p>";
          }
        });
    }
  });
}

// const $ones = document.querySelector("#search-submit");
// const $searchElem = document.querySelector("#search-submit");
// $ones.addEventListener('click', () => {
//   fetch('/filters')
//   .then((res) => {
//    return res.json()
//    console.log(res);
//   })
// .then((res) => {
//   const el = [];
//   for(let i = 0; i < res.length; i++){
//     if(res[i].title == 'Sanofi'){
//       console.log(res[i])
//     el.push(res[i]);
//   }
//   }
//   console.log(el);
//   // const htmls = el.map(c => {
//   //     return `<p>${c.maker}5</p> ${c.quantity}`
// //})
// })})


M.Tabs.init(document.querySelectorAll('.tabs'));

let instance = M.Carousel.getInstance(document.querySelector('.carousel'));
  setInterval(() => {
    instance.next();
  }, 3500)

$('.carousel.carousel-slider').carousel({
  fullWidth: true,
  indicators: true
});