import sleuther from "@magda/sleuther-framework/dist/index";
import linkedDataAspectDef from "./linkedDataAspectDef";
import datasetQualityAspectDef from "./linkedDataAspectDef";
import onRecordFound from "./onRecordFound";

const ID = "sleuther-linked-data-rating";
const host = process.env.HOST || ID;

function sleuthLinkedData() {
  sleuther({
    host,
    id: ID,
    defaultPort: 6109,
    aspects: ["dataset-distributions"],
    optionalAspects: [],
    writeAspectDefs: [linkedDataAspectDef, datasetQualityAspectDef],
    onRecordFound
  }).catch(e => {
    console.error("Error: " + e.message, e);
  });
}

sleuthLinkedData();
