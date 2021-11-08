import { scan } from "../utils/scan";
import { traverseScanChinese } from "./traverse-scan-chinese";

async function scanChinese() {
	scan("scan chinese", traverseScanChinese);
}

export { scanChinese };
