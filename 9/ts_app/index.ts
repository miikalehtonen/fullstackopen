import express, { Request, Response } from "express";
import calculateBmi from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

const app = express();
app.use(express.json());

interface ExerciseRequest {
  daily_exercises: number[];
  target: number;
}

app.get("/ping", (_req: Request, res: Response): void => {
  res.send("pong");
});

app.get("/hello", (_req: Request, res: Response): void => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req: Request, res: Response): void => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: "malformatted parameters" });
    return;
  }

  res.json({
    height,
    weight,
    bmi: calculateBmi(height, weight),
  });
});

app.post(
  "/exercises",
  (req: Request<object, object, ExerciseRequest>, res: Response): void => {
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || target === undefined) {
      res.status(400).json({ error: "parameters missing" });
      return;
    }

    if (
      !Array.isArray(daily_exercises) ||
      daily_exercises.some((h) => isNaN(Number(h))) ||
      isNaN(Number(target))
    ) {
      res.status(400).json({ error: "malformatted parameters" });
      return;
    }

    const result = calculateExercises(
      daily_exercises.map(Number),
      Number(target)
    );
    res.json(result);
  }
);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
