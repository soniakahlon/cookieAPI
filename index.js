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

function displayResults(responseJson, to, ingr, excluded) {
  console.log(responseJson);
  $("#results-list").empty();
  if (responseJson.hits.length === 0) {
    $("#results-list").append("<h1>No recipes found. Try a new search.</h1>");
   
  }
  for (let i = 0; (i < responseJson.hits.length) & (i < to); i++) {
    $("#results-list").append(
      `<div class="results">
           <div class="box">
            <li><img class=recipeimage alt="picture of cookie" src="${
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

  $("html, body").animate(
    {
      scrollTop: $("#results-list").offset().top
    },
    2000
  );
}

function getRecipes(searchTerm, to, ingr, excluded) {
  const params = {
    app_id: apiId,
    app_key: apiKey,
    to,
    q: `cookie&${searchTerm}`,
    ingr: `${ingr}`,
    excluded: `${excluded}`
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
    .then(responseJson => displayResults(responseJson, to, ingr, excluded))
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
    const excluded = $("#js-exclu-ingr").val();

    getRecipes(searchTerm, to, ingr, excluded);
  });
}

$(watchForm);
