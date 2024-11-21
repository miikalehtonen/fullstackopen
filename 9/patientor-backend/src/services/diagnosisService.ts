import diagnoses from "../diagnoses";
import { Diagnosis } from "../types";

const getDiagnoses = (): Diagnosis[] => diagnoses;

export default { getDiagnoses };
