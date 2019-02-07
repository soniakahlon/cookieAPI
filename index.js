"use strict";

const apiId = "6f22b9fb";
const apiKey = "a298731d978e5be221090b36100fe9d9";

const searchURL = "https://api.edamam.com/search";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson, to, ingr, healthLabels) {
  console.log(responseJson);
  $("#results-list").empty();

  for (let i = 0; (i < responseJson.hits.length) & (i < to); i++) {
    $("#results-list").append(
      `<div class="results">
           <div class="box">
            <li><img  alt="picture of cookie" src="${
              responseJson.hits[i].recipe.image
            }">
            </div>
        <div class="box">
            <h4><a href="${responseJson.hits[i].recipe.url}">${
        responseJson.hits[i].recipe.label
      }</a></h4></div>
      </li></div>`
    );
  }

  $("#results").removeClass("hidden");

  $('html, body').animate({
    scrollTop: $("#results-list").offset().top
  }, 2000);
}

function getRecipes(searchTerm, to, ingr, healthLabels) {
  const params = {
    app_id: apiId,
    app_key: apiKey,
    to,
    q: `cookie&${searchTerm}`,
    ingr: `${ingr}`,
    healthLabels: `${healthLabels}`
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, to, ingr, healthLabels))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const to = $("#js-max-results").val();
    const ingr = $("#js-max-ingr").val();
    const healthFree = $(".numbers:checked");
    const healthLabels = [];
    for (let i = 0; i < healthFree.length; i++) {
      healthLabels.push($(healthFree[i]).val());
    }
    getRecipes(searchTerm, to, ingr, healthLabels);
  });
}


$(watchForm);
