import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Divider, Box, Button } from "@mui/material";
import { Male, Female, QuestionMark } from "@mui/icons-material";
import { Diagnosis, Entry, Gender, Patient, NewEntry } from "../../types";
import { apiBaseUrl } from "../../constants";
import EntryDetails from "../EntryDetails";
import AddEntryForm from "../AddEntryForm";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientData } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        setPatient(patientData);
      } catch (error) {
        console.error("Error fetching patient details", error);
      }
    };
    const fetchDiagnoses = async () => {
      try {
        const { data: diagnosisData } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        setDiagnoses(diagnosisData);
      } catch (error) {
        console.error("Error fetching diagnoses", error);
      }
    };
    void fetchPatient();
    void fetchDiagnoses();
  }, [id]);

  const getGenderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return <Male />;
      case Gender.Female:
        return <Female />;
      case Gender.Other:
        return <QuestionMark />;
      default:
        return null;
    }
  };

  const getDiagnosisName = (code: string): string | undefined => {
    const diagnosis = diagnoses?.find((d) => d.code === code);
    return diagnosis ? `${code} ${diagnosis.name}` : code;
  };

  const handleAddEntry = async (entry: NewEntry) => {
    try {
      const { data: addedEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        entry
      );
      if (patient) {
        setPatient({
          ...patient,
          entries: patient.entries.concat(addedEntry),
        });
      }
      setFormOpen(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        console.log(e);
        setError("An unexpected error occurred");
      }
    }
  };

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5">
        {patient.name} {getGenderIcon(patient.gender)}
      </Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      {patient.ssn && <Typography>SSN: {patient.ssn}</Typography>}
      {patient.dateOfBirth && (
        <Typography>Date of Birth: {patient.dateOfBirth}</Typography>
      )}
      <Divider style={{ margin: "1em 0" }} />
      <Typography variant="h6">Entries</Typography>
      {patient.entries.length === 0 ? (
        <Typography>No entries available</Typography>
      ) : (
        patient.entries.map((entry: Entry) => <EntryDetails key={entry.id} entry={entry} getDiagnosisName={getDiagnosisName} />)
      )}
      <Button
        variant="contained"
        onClick={() => setFormOpen(!formOpen)}
        style={{ marginBottom: "1em" }}
      >
        {formOpen ? "Cancel" : "Add New Entry"}
      </Button>
      {formOpen && (
        <AddEntryForm
          onSubmit={handleAddEntry}
          onCancel={() => setFormOpen(false)}
          error={error}
          availableDiagnosisCodes={diagnoses ? diagnoses.map((d) => d.code) : []}
        />
      )}
    </Box>
  );
};

export default PatientDetailPage;
