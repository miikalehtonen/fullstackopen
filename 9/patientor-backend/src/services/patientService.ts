import patients from "../patients";
import { Entry, NewEntry, Patient } from "../types";
import { v1 as uuid } from "uuid";

const getPatients = (): Omit<Patient, "ssn" | "entries">[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));

const addPatient = (patient: Patient): Patient => {
  patients.push(patient);
  return patient;
};

const getPatientById = (id: string): Patient | undefined => {
  const patient = patients.find((patient) => patient.id === id);
  if (patient) {
    return { ...patient };
  }
  return undefined;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = getPatientById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry = {
    id: uuid(),
    ...entry,
  } as Entry;

  patient.entries.push(newEntry);
  return newEntry;
};

export default { getPatients, addPatient, getPatientById, addEntry };
