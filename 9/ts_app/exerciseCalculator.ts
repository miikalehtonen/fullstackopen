interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((h) => h > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;

  let rating;
  let ratingDescription;

  if (average >= target) {
    rating = 3;
    ratingDescription = "good";
  } else if (average >= target * 0.7) {
    rating = 2;
    ratingDescription = "not too bad but could be better.";
  } else {
    rating = 1;
    ratingDescription = "bad";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (require.main === module) {
  const args = process.argv.slice(2).map(Number);

  if (args.some(isNaN)) {
    console.error("Please provide valid numbers.");
    process.exit(1);
  }

  const target = args[0];
  const dailyHours = args.slice(1);

  console.log(calculateExercises(dailyHours, target));
}

export default calculateExercises;
