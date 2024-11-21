import express from "express";
import { v1 as uuid } from "uuid";
import patientService from "../services/patientService";
import { newPatientSchema } from "../utils";
import { z } from "zod";
import { toNewEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(patientService.getPatients());
});

router.get("/:id", (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send({ error: "Patient not found" });
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(req.params.id, newEntry);
    res.json(addedEntry);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});


router.post("/", (req, res) => {
  try {
    const parsedPatient = newPatientSchema.parse(req.body);

    const newPatient = {
      id: uuid(),
      entries: [],
      ...parsedPatient,
    };

    const addedPatient = patientService.addPatient(newPatient);

    res.status(201).json(addedPatient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: "Unknown server error" });
    }
  }
});

export default router;
