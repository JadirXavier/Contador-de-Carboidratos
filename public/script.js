const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const foodList = document.getElementById("food-list");
const gramasTotais = document.getElementById("gramas-totais");

let selected = [];

if (searchInput) {
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length < 3) {
      searchResults.innerHTML = "";
      return;
    }
    try {
      const response = await fetch(`/nutrients?q=${query}`);
      const nutrients = await response.json();
      searchResults.innerHTML = "";
      for (const nutrient of nutrients) {
        const li = document.createElement("li");
        li.textContent = nutrient.nome;
        li.addEventListener("click", () => {
          selected.push(nutrient);
          const tr = document.createElement("tr");
          const tdNome = document.createElement("td");
          tdNome.textContent = nutrient.nome;
          const tdPorcao = document.createElement("td");
          tdPorcao.classList.add("centralizar");
          const inputPorcao = document.createElement("input");
          inputPorcao.type = "number";
          inputPorcao.min = "0";
          inputPorcao.max = "9999";
          inputPorcao.value = "";
          inputPorcao.maxLength = 4;
          inputPorcao.classList.add("input");
          tdPorcao.appendChild(inputPorcao);

          function calculaValores(input) {
            const valorInput = parseInt(input.value);
            if (input.value == "") {
              tdGramas.textContent = "0.00" + "g";
            } else {
              tdGramas.textContent =
                ((valorInput * gramasIniciais) / 100).toFixed(2) + "g";
            }

            const tdsGramas = document.querySelectorAll(".tdGramas");

            const somaGramas = Array.from(tdsGramas).reduce(
              (acumulador, td) => {
                const valorNumerico = parseFloat(
                  td.textContent.replace("g", "")
                );
                if (isNaN(acumulador + valorNumerico)) {
                  return 0;
                } else {
                  return acumulador + valorNumerico;
                }
              },
              0
            );
            gramasTotais.textContent = somaGramas.toFixed(2) + "g";
          }

          const tdGramas = document.createElement("td");
          tdGramas.classList.add("centralizar");
          tdGramas.classList.add("tdGramas");

          const gramasIniciais = parseFloat(
            nutrient.carboidratos
              .substring(0, nutrient.carboidratos.length - 1)
              .replace(",", ".")
          );

          const tdFechar = document.createElement("td");
          tdFechar.classList.add("centralizar");
          tdFechar.textContent = "\u274C";
          tdFechar.addEventListener("click", () => {
            const index = selected.indexOf(nutrient);
            if (index > -1) {
              selected.splice(index, 1);
            }
            tr.remove();

            calculaValores(tdFechar);
          });

          tr.appendChild(tdNome);
          tr.appendChild(tdPorcao);
          tr.appendChild(tdGramas);
          tr.appendChild(tdFechar);
          foodList.appendChild(tr);

          function removeZerosEsquerda(input) {
            if (input.value.length > 1) {
              input.value = parseInt(input.value).toString();
            }
          }

          inputPorcao.addEventListener("input", () => {
            const maxLength = 4;

            if (inputPorcao.value.length > maxLength) {
              inputPorcao.value = inputPorcao.value.slice(0, maxLength);
            }
            removeZerosEsquerda(inputPorcao);
            calculaValores(inputPorcao);
          });

          searchInput.value = "";
          searchResults.innerHTML = "";
          const inputs = document.querySelectorAll(".input");
          const ultimoInput = inputs[inputs.length - 1];
          ultimoInput.focus();
        });

        searchResults.appendChild(li);
      }
    } catch (error) {
      console.error(error);
    }
  });
}
