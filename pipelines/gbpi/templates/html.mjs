export const htmlTemplate = (
  map,
  {
    indexSubTitle,
    indexTitle,
    indexShortTitle,
    mimhTitle,
    ownershipRateTitle,
    medianQueueTimeTitle,
    medianRentTitle,
  }
) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${indexShortTitle} - ${indexTitle}</title>
    <link rel="icon" type="image/png" href="images/home.png" />
    <link rel="stylesheet" href="styles/index.css" />
  </head>
  <body>
    <h1>${indexTitle} - ${indexSubTitle}</h1>
    
      <p>
      Göteborgs Boendeprisindex är ett index som ger en bild av hur lätt
      eller svårt det är att hitta bostad i Göteborg.
     </p>

    <div class="mapContainer">
      <div id="svg"> ${map}</div>
    </div>

    <br />

    <p>
      Indexet baseras på följande faktorer som tillsammans ger en rättvis
      bild av bostadssituationen per primärområde:
    </p>

    <ul>
      <li>
        <b> Genomsnittlig kötid för hyresrätter</b> – Hur lång tid det i
        genomsnitt tar att få en hyresrätt i området.
      </li>
      <li>
        <b>Fastighetspris i förhållande till medianinkomst</b> – Hur prisvärda
        bostäder är i förhållande till hushållens inkomster.
      </li>
      <li>
        <b>Medianhyra per kvm på andrahandsmarknaden</b> – Speglar kostnaden för
        att hyra bostad utanför den regulerade hyresmarknaden
      </li>
      <li>
        <b> Bostadsägarandel</b> – Andelen bostäder som ägs jämfört med hyrs.
      </li>
    </ul>

    <p>Resultatet presenteras på en femgradig skala:</p>

    <ol>
      <li>Enkelt</li>
      <li>Möjligt</li>
      <li>Utmanande</li>
      <li>Svårt</li>
      <li>Mycket svårt</li>
    </ol>

    <p>
      Du kan enkelt söka efter en specifik adress eller områdets namn för att få
      en snabb överblick över bostadssituationen i just det området. Tabellen
      hjälper dig att jämföra olika områden och förstå hur faktorerna påverkar
      tillgängligheten på bostadsmarknaden.
    </p>

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
          <th id="table-header-area" class="activeSort">Område</th>
          <th id="table-header-status">Status</th>
          <th id="table-header-index">${indexShortTitle}</th>
          <th id="table-header-mimh">
          <div class="tableTooltip">
            ${mimhTitle}
              <span>Kvot mellan medianfastighetspris (MP) och medianinkomst (MI)</span>
            </div>  
          </th>
          <th id="table-header-medianQueueTime">${medianQueueTimeTitle} </th>
          <th id="table-header-ownershipRate">${ownershipRateTitle} </th>
          <th id="table-header-medianRent">${medianRentTitle} </th>
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
