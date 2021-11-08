import { scan } from "../utils/scan";
import { traverseExportAggregate } from "./traverse-export-aggregate";

async function exportAggregate() {
	return scan("scan chinese", traverseExportAggregate);
}

export { exportAggregate };
