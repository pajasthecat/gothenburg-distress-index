import addressInput from "../data/excel-to-json.json" with {"type": "json"}
import { writeFileSync } from "fs";

const output = addressInput["Adresser Göteborg 2024-07-09"].map(_ => {
    const address = _["Områdena avser indelningen som gäller från och med 2024-01-01"];
    const postCode = _["__EMPTY"];
    const primary_area = _["__EMPTY_3"];

    return {address, primary_area}
});

writeFileSync("./data/primary-area.json", JSON.stringify(output));

