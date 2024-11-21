import React from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { LocalHospital, Work, MedicalServices, Favorite } from "@mui/icons-material";
import { Entry } from "../../types";

interface Props {
  entry: Entry;
  getDiagnosisName: (code: string) => string | undefined;
}

const EntryDetails: React.FC<Props> = ({ entry, getDiagnosisName }) => {
    const getHealthCheckColor = (rating: 0 | 1 | 2 | 3): string => {
        switch (rating) {
          case 0:
            return "green";
          case 1:
            return "yellow";
          case 2:
            return "orange";
          case 3:
            return "red";
          default:
            return "grey";
        }
      };
  switch (entry.type) {
    case "Hospital":
      return (
        <Card variant="outlined" style={{ marginBottom: "1em" }}>
          <CardContent>
            <Typography variant="h6">
              {entry.date} <LocalHospital />
            </Typography>
            <Typography>{entry.description}</Typography>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((code) => (
                  <li key={code}>{getDiagnosisName(code)}</li>
                ))}
              </ul>
            )}
            <Typography variant="body2">
              Discharge: {entry.discharge.date} ({entry.discharge.criteria})
            </Typography>
            <Typography variant="body2">
              Diagnose by {entry.specialist}
            </Typography>
          </CardContent>
        </Card>
      );

    case "OccupationalHealthcare":
      return (
        <Card variant="outlined" style={{ marginBottom: "1em" }}>
          <CardContent>
            <Typography variant="h6">
              {entry.date} <Work /> {entry.employerName}
            </Typography>
            <Typography>{entry.description}</Typography>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((code) => (
                  <li key={code}>{getDiagnosisName(code)}</li>
                ))}
              </ul>
            )}
            {entry.sickLeave && (
              <Typography variant="body2">
                Sick leave: {entry.sickLeave.startDate} -{" "}
                {entry.sickLeave.endDate}
              </Typography>
            )}
            <Typography variant="body2">
              Diagnose by {entry.specialist}
            </Typography>
          </CardContent>
        </Card>
      );

    case "HealthCheck":
      return (
        <Card variant="outlined" style={{ marginBottom: "1em" }}>
          <CardContent>
            <Typography variant="h6">
              {entry.date} <MedicalServices />
            </Typography>
            <Typography>{entry.description}</Typography>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((code) => (
                  <li key={code}>{getDiagnosisName(code)}</li>
                ))}
              </ul>
            )}
            <Favorite style={{ color: getHealthCheckColor(entry.healthCheckRating) }} />
            <Typography variant="body2">
              Diagnose by {entry.specialist}
            </Typography>
          </CardContent>
        </Card>
      );

    default:
      throw new Error(`Unhandled entry type: ${JSON.stringify(entry)}`);
  }
};

export default EntryDetails;
