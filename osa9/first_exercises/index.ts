import { bmiCalculator } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import express from 'express';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.send({ error: 'malformatted parameters' });
  }

  res.send(bmiCalculator(height, weight));
});

app.post('/exercises', (req, res) => {
  const params = req.body;

  if (!params.daily_exercises || !params.target) {
    res.send({ error: "parameters missing" });
  }

  const days = params.daily_exercises.map((val: string) => Number(val));
  const target = Number(params.target)

  if (days.includes(NaN) || isNaN(target)) {
    res.send({ error: 'malformatted parameters' });
  }

  const result = calculateExercises(days, target)
  res.json(result)
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});