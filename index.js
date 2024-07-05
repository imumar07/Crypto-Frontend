let currency = document.getElementById("currency");
let stock = document.getElementById("stock");
let button = document.getElementById("buyButton");
let tableBody = document.getElementById("priceTableBody");
let bestPrice = document.getElementById("bestPrice");
let averageText=document.getElementById("averageText");
const checkbox = document.getElementById('switch');
const progressBar = document.querySelector('[role="progressbar"]');
let value = parseInt(progressBar.style.getPropertyValue('--value'));

function handleCheckboxChange(event) {
    const isChecked = event.target.checked;
    const mainContainer = document.querySelector('.main-container');
  
    if (isChecked) {
      mainContainer.classList.remove('theme-light');
      mainContainer.classList.add('theme-dark');
      console.log('Changed to dark theme');
      // Perform additional actions for dark theme
    } else {
      mainContainer.classList.remove('theme-dark');
      mainContainer.classList.add('theme-light');
      console.log('Changed to light theme');
      // Perform additional actions for light theme
    }
  }
// Update value every second until it reaches 0
const interval = setInterval(() => {
  value--;
  progressBar.style.setProperty('--value', value);
  
  // Stop the interval when value reaches 0
  if (value === 0) {
    progressBar.style.setProperty('--value', 60);

    value=60;

    onPageLoad();
  }
}, 1000); // 1000 milliseconds = 1 second

function formatNumberToIndianSystem(number) {
    const x = number.toString().split('.');
    let integerPart = x[0];
    const decimalPart = x.length > 1 ? '.' + x[1] : '';
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherDigits ? ',' : '') + lastThreeDigits + decimalPart;
    if(formattedNumber==="Infinity") return "Infinity";
    return formattedNumber;
  }

  function createTableRows(data) {
    tableBody.innerHTML = "";

    // Calculate average
    let average = 0;
    data.forEach(exchange => {
        average += parseFloat(exchange.last);
    });
    average /= data.length;
    average = Math.floor(average);

    bestPrice.textContent = `₹ ${formatNumberToIndianSystem(average)}`;

    data.forEach((exchange, index) => {
        const row = document.createElement("tr");

        // Calculate change percentage
        let changePercentage = ((parseFloat(exchange.last) - average) / average) * 100;
        console.log(changePercentage);
        changePercentage = isFinite(changePercentage) ? changePercentage.toFixed(2) : "Infinity";

        // Calculate savings
        let savings = parseFloat(exchange.last) - average;
        savings = isFinite(savings) ? savings.toFixed(2) : "Infinity";

        // Create row HTML
        row.innerHTML = `
            <td class="align-middle"><h4 class="table-text">${index + 1}</h4></td>
            <td class="align-middle">
                <a target="_blank" href="" class="d-flex flex-row justify-content-center align-items-center">
                    <img src="company.png" class="exchange-logo" alt="Exchange Logo" />
                    <h4 class="table-text">
                        <span class="exchange-name">WazirX</span>
                    </h4>
                </a>
            </td>
            <td class="align-middle">
                <h4 class="table-text">₹ ${formatNumberToIndianSystem(exchange.last)}</h4>
            </td>
            <td class="align-middle">
                <h4 class="table-text">
                    <span>₹ ${formatNumberToIndianSystem(exchange.buy)} / ₹ ${formatNumberToIndianSystem(exchange.sell)}</span>
                </h4>
            </td>
            <td class="align-middle">
                <h4 class="table-text color-${changePercentage > 0 ? "green" : "red"}">${changePercentage}%</h4>
            </td>
            <td class="align-middle">
                <h4 class="table-text color-${savings > 0 ? 'green' : 'red'}">
                    ${savings > 0 ? `▲ ₹ ${savings}` : `▼ ₹ ${savings}`}
                </h4>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


async function onPageLoad() {
   
  button.textContent = `Buy ${stock.value.toUpperCase()}`;
  const data = await fetch(
    `https://crypto-backend-zeta.vercel.app/${stock.value.toUpperCase()}-INR`,
    { method: "GET", headers: { "Content-Type": "application/json" } }
  );
  const response = await data.json();
  averageText.textContent = `Average ${stock.value.toUpperCase()}/${currency.value.toUpperCase()} net price including commission`;
  createTableRows(response)
}

// Run the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", onPageLoad);
const themeSwitch = document.getElementById('switch');
themeSwitch.addEventListener('change', handleCheckboxChange);
button.textContent = `Buy ${stock.value.toUpperCase()}`;

stock.addEventListener("change", async () => {
  button.textContent = `Buy ${stock.value.toUpperCase()}`;
  averageText.textContent = `Average ${stock.value.toUpperCase()}/${currency.value.toUpperCase()} net price including commission`;

  const data = await fetch(
    `https://crypto-backend-zeta.vercel.app/${stock.value.toUpperCase()}-INR`,
    { method: "GET", headers: { "Content-Type": "application/json" } }
  );
  const response = await data.json();
  console.log(response);
  if(response.length === 0){
    tableBody.innerHTML = "";

    bestPrice.textContent = `No Data Available`;
  }else{

  createTableRows(response);
    }
});
checkbox.addEventListener('change', handleCheckboxChange);
setInterval(async () => onPageLoad(), 60000);
