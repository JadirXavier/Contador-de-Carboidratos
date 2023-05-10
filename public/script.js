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
            console.log(tdsGramas);
            const somaGramas = Array.from(tdsGramas).reduce(
              (acumulador, td) => {
                const valorNumerico = parseFloat(
                  td.textContent.replace("g", "")
                );

                return acumulador + valorNumerico;
              },
              0
            );
            gramasTotais.textContent = somaGramas.toFixed(2) + "g";
            console.log(gramasTotais.textContent);
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
            const tdsGramas = document.querySelectorAll(".tdGramas");
            console.log(tdsGramas);
            // soma o valor numérico de todas as tds
            const somaGramas = Array.from(tdsGramas).reduce(
              (acumulador, td) => {
                // extrai o valor numérico da td (sem o "g" no final)
                const valorNumerico = parseFloat(
                  td.textContent.replace("g", "")
                );
                // soma o valor numérico ao acumulador

                return acumulador + valorNumerico;
              },
              0
            );
            gramasTotais.textContent = somaGramas.toFixed(2) + "g";
            console.log(gramasTotais.textContent);
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

// let soma = 0;
// for (let i = 0; i < tds.length; i++) {
//   soma += parseFloat(tds[i].textContent);
// }

// // Verifica se a linha de total já existe
// const totalRow = document.querySelector(".total");

// // Se não existir, cria uma nova linha de total
// if (!totalRow) {
//   const table = document.querySelector("table");
//   const newRow = table.insertRow();
//   newRow.classList.add("total");

//   const cell1 = newRow.insertCell();
//   cell1.textContent = "Total";

//   const cell2 = newRow.insertCell();
//   cell2.textContent = soma;
// }

// if (searchInput) {
//   searchInput.addEventListener("input", async () => {
//     const query = searchInput.value.trim();
//     if (query.length < 3) {
//       searchResults.innerHTML = "";
//       return;
//     }
//     try {
//       const response = await fetch(`/nutrients?q=${query}`);
//       const nutrients = await response.json();
//       searchResults.innerHTML = "";
//       for (const nutrient of nutrients) {
//         const li = document.createElement("li");
//         li.textContent = `${nutrient.nome} (${nutrient.carboidratos}g)`;
//         li.addEventListener("click", () => {
//           selected.push(nutrient);
//           const selectedLi = document.createElement("li");
//           selectedLi.textContent = `${nutrient.nome} (${nutrient.carboidratos}g)`;
//           selectedFoods.appendChild(selectedLi);
//           searchInput.value = "";
//           searchResults.innerHTML = "";
//         });
//         searchResults.appendChild(li);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   });
// }
