export const htmlTemplate = (
  map,
  { indexTitle, indexShortTitle, mimhTitle }
) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Göteborgs Boendebarometer</title>
    <link rel="icon" type="image/png" href="images/home.png" />
    <link rel="stylesheet" href="styles/index.css" />
  </head>
  <body>
    <h1>${indexTitle}</h1>

    <div class="mapContainer">
      <div id="svg"> ${map}</div>
    </div>

    <br />

    <form id="searchTextForm">
      <div class="inputContainer">
        <input
          type="search"
          id="searchText"
          placeholder="Sök på din adress och område"
        />
      </div>
    </form>

    <br />

    <div class="tableContainer">
      <table id="allPrimaryAreas">
        <tr>
          <th id="table-header-area" class="headerSortUp">Område</th>
          <th id="table-header-status">Status</th>
          <th id="table-header-index">${indexShortTitle}</th>
          <th id="table-header-mimh">${mimhTitle} div <span id="mimhTooltip" class="mimhTooltip">This is my tooltip</span> </th>
        </tr>
      </table>
    </div>

    <footer>
      <div class="footerContainer">
        <div class="footerImageContainer">
          <a href="mailto: henrik.forsberg1990@gmail.com">
            <img src="images/email.png" alt="email icon"
          /></a>
          <a
            href="https://github.com/pajasthecat/gothenburg-distress-index"
            ,
            target="_blank"
          >
            <img src="images/github.png" alt="github icon" />
          </a>
        </div>
        <div class="footerTextContainer">
          <div></div>
          <p>No tracking. No cookies. No visit logs.</p>
          <div></div>
        </div>

        <div class="footerTextContainer">
          <a href="https://www.flaticon.com/free-icons/living" title="living icons">Living icons created by iconixar - Flaticon</a>
        </div>

        <div class="footerTextContainer">
          <div></div>
          <p>©2024 Henrik Forsberg.</p>
          <div></div>
        </div>
      </div>
    </footer>
    <script type="module" src="./scripts/index.mjs"></script>
  </body>
</html>

`;
