import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { NewEntry } from "../../types";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
  error?: string;
  availableDiagnosisCodes: string[];
}

const AddEntryForm = ({
  onSubmit,
  onCancel,
  error,
  availableDiagnosisCodes,
}: Props) => {
  const [type, setType] = useState<
    "HealthCheck" | "Hospital" | "OccupationalHealthcare"
  >("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const handleSubmit = () => {
    let newEntry: NewEntry;

    switch (type) {
      case "HealthCheck":
        newEntry = {
          type,
          description,
          date,
          specialist,
          healthCheckRating: parseInt(healthCheckRating),
          diagnosisCodes,
        };
        break;

      case "Hospital":
        newEntry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;

      case "OccupationalHealthcare":
        newEntry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? {
                  startDate: sickLeaveStart,
                  endDate: sickLeaveEnd,
                }
              : undefined,
        };
        break;

      default:
        throw new Error("Invalid entry type");
    }

    onSubmit(newEntry);
  };

  return (
    <Box>
      <Typography variant="h6">New {type} Entry</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <InputLabel style={{ marginBottom: "0.5em" }}>Type</InputLabel>
      <Select
        value={type}
        onChange={({ target }) =>
          setType(
            target.value as
              | "HealthCheck"
              | "Hospital"
              | "OccupationalHealthcare"
          )
        }
        fullWidth
        style={{ marginBottom: "1em" }}
      >
        <MenuItem value="HealthCheck">HealthCheck</MenuItem>
        <MenuItem value="Hospital">Hospital</MenuItem>
        <MenuItem value="OccupationalHealthcare">
          OccupationalHealthcare
        </MenuItem>
      </Select>
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        style={{ marginBottom: "1em" }}
      />
      <TextField
        fullWidth
        label="Date"
        type="date"
        placeholder="Date"
        value={date}
        onChange={({ target }) => setDate(target.value)}
        style={{ marginBottom: "1em" }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        label="Specialist"
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
        style={{ marginBottom: "1em" }}
      />
      <InputLabel style={{ marginBottom: "0.5em" }}>Diagnosis Codes</InputLabel>
      <Select
        multiple
        value={diagnosisCodes}
        onChange={({ target }) => setDiagnosisCodes(target.value as string[])}
        input={<OutlinedInput label="Diagnosis Codes" />}
        renderValue={(selected) => (
          <Box>
            {selected.map((value: string) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        fullWidth
        style={{ marginBottom: "1em" }}
      >
        {availableDiagnosisCodes.map((code: string) => (
          <MenuItem key={code} value={code}>
            {code}
          </MenuItem>
        ))}
      </Select>

      {type === "HealthCheck" && (
        <TextField
          fullWidth
          label="HealthCheck Rating (0-3)"
          type="number"
          value={healthCheckRating}
          onChange={({ target }) => setHealthCheckRating(target.value)}
          style={{ marginBottom: "1em" }}
        />
      )}
      {type === "Hospital" && (
        <>
          <TextField
            fullWidth
            label="Discharge Date"
            type="date"
            placeholder="Discharge Date"
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
            style={{ marginBottom: "1em" }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Discharge Criteria"
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
            style={{ marginBottom: "1em" }}
          />
        </>
      )}
      {type === "OccupationalHealthcare" && (
        <>
          <TextField
            fullWidth
            label="Employer Name"
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
            style={{ marginBottom: "1em" }}
          />
          <TextField
            fullWidth
            label="Sick Leave Start"
            type="date"
            placeholder="Sick Leave Start"
            value={sickLeaveStart}
            onChange={({ target }) => setSickLeaveStart(target.value)}
            style={{ marginBottom: "1em" }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Sick Leave End"
            type="date"
            placeholder="Sick Leave End"
            value={sickLeaveEnd}
            onChange={({ target }) => setSickLeaveEnd(target.value)}
            style={{ marginBottom: "1em" }}
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
