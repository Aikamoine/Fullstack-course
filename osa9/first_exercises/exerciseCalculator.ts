interface result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const rating = (average: number, target: number): [string, number] => {
  const diff = average - target;
  if (diff > 0) {
    return ['noic!', 3];
  }

  if (diff === 0) {
    return ['target achieved', 2];
  }

  return ['thou hast failed', 1];
};

export const calculateExercises = (
  days: number[], target: number
): result => {
    
  const trainingDays = days.filter(d => d > 0).length;
  const average = days.reduce((p, c) => p + c, 0) / days.length;
  const thisRating = rating(average, target);
  

  return {
    periodLength: days.length,
    trainingDays: trainingDays,
    success: average >= target,
    rating: thisRating[1],
    ratingDescription: thisRating[0],
    target: target,
    average: average
  };
};

/*
const parseArguments = (args: string[]) => {
  if (args.length < 4) throw new Error('Not enough arguments');
  
  const check = args.slice(2).map(val => !isNaN(Number(val)));

  if (check.includes(false)) {
    throw new Error('parameters contain non-number values');
  }

  const target = Number(args[2]);
  const dayString = args.slice(3);
  const days = dayString.map(d => Number(d));

  return {
    target: target,
    days: days
  };
};

try {
  const { target, days } = parseArguments(process.argv);
  console.log(calculateExercises(days, target));
} catch (error: unknown) {
  let errorMessage = 'There was, like, an error';
  if (error instanceof Error) {
    errorMessage += ': ' + error.message;
  }
  console.log(errorMessage);
}
*/