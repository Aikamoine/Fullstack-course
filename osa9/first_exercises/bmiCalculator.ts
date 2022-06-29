const calculateBmi = (height: number, weight: number) => {
  const bmi = weight / ((height / 100) ^ 2);

  if (bmi <= 16) {
    return 'Underweight (Severe thinness)';
  }

  if (bmi <= 16.9) {
    return 'Underweight (Moderate thinness)';
  }

  if (bmi <= 18.4) {
    return 'Underweight (Mild thinness)';
  }

  if (bmi <= 24.9) {
    return 'Normal (healthy weight)';
  }

  if (bmi <= 29.9) {
    return 'Overweight (Pre-obese)';
  }

  if (bmi <= 34.9) {
    return 'Obese (Class I)';
  }

  if (bmi <= 39.9) {
    return 'Obese (Class II)';
  }

  return 'Obese (Class III)';
};


export const bmiCalculator = (height: number, weight: number) => {
  const bmi = calculateBmi(height, weight);

  return {
    weight: weight,
    height: height,
    bmi: bmi
  };
};

/*
const parseArgumentsBmi = (args: string[]) => {
  if (args.length < 4) throw new Error('Not enough arguments')
  if (args.length > 4) throw new Error('Too many arguments')

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    }
  } else {
    throw new Error('Provided values were not numbers!')
  }
}


try {
  const { height, weight } = parseArgumentsBmi(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'There was, like, an error';
  if (error instanceof Error) {
    errorMessage += ': ' + error.message;
  }
  console.log(errorMessage);
}
*/