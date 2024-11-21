import { z } from "zod";
import { NewEntry } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isHealthCheckRating = (param: unknown): param is 0 | 1 | 2 | 3 => {
  return typeof param === "number" && [0, 1, 2, 3].includes(param);
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Invalid entry data");
  }

  const baseEntry = {
    date: parseDate((object as { date: unknown }).date),
    specialist: parseString((object as { specialist: unknown }).specialist),
    description: parseString((object as { description: unknown }).description),
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  switch ((object as { type: unknown }).type) {
    case "Hospital":
      return {
        ...baseEntry,
        type: "Hospital",
        discharge: {
          date: parseDate((object as { discharge: { date: unknown } }).discharge.date),
          criteria: parseString((object as { discharge: { criteria: unknown } }).discharge.criteria),
        },
      } as NewEntry;
    case "OccupationalHealthcare":
      return {
        ...baseEntry,
        type: "OccupationalHealthcare",
        employerName: parseString((object as { employerName: unknown }).employerName),
        sickLeave: (object as { sickLeave?: { startDate: unknown; endDate: unknown } }).sickLeave
          ? {
            startDate: parseDate((object as { sickLeave: { startDate: unknown } }).sickLeave.startDate),
            endDate: parseDate((object as { sickLeave: { endDate: unknown } }).sickLeave.endDate),
            }
          : undefined,
      } as NewEntry;
    case "HealthCheck":
      return {
        ...baseEntry,
        type: "HealthCheck",
        healthCheckRating: parseHealthCheckRating(
          (object as { healthCheckRating: unknown }).healthCheckRating
        ),
      } as NewEntry;
    default:
      throw new Error(`Unsupported entry type: ${(object as { type: unknown }).type}`);
  }
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error(`Invalid or missing date: ${date}`);
  }
  return date;
};

const parseString = (text: unknown): string => {
  if (!isString(text)) {
    throw new Error(`Invalid or missing string: ${text}`);
  }
  return text;
};

const parseHealthCheckRating = (rating: unknown): 0 | 1 | 2 | 3 => {
  if (!isHealthCheckRating(rating)) {
    throw new Error(`Invalid health check rating: ${rating}`);
  }
  return rating;
};

const parseDiagnosisCodes = (object: unknown): string[] => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [];
  }
  return object.diagnosisCodes as string[];
};

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  gender: z.enum(["male", "female", "other"]),
  occupation: z.string(),
  ssn: z.string(),
});
