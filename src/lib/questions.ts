// Statically declare expected fields of a question
export interface QuestionParameters {
  x: number
  y: number
  operator: '+' | '-' | '*' | '/' | ''
  question?: string
  answer?: string
}

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generateNewQuestion = (): QuestionParameters => {
  let newQuestion: QuestionParameters = {
    x: randomNumber(1, 10), // Random number between 1 and 10
    y: randomNumber(1, 10),
    // Biased operator selection, with highest chance of addition.
    operator: Math.random() > 0.5 ? '+' : Math.random() > 0.5 ? '-' : '*',
    answer: '' // Reset answer field
  }
  newQuestion.question = `${newQuestion.x} ${newQuestion.operator} ${newQuestion.y} = ?`
  return newQuestion
}

export const answerHandler = (q: QuestionParameters): boolean => {
  // Check if the Number() value of the field is correct.
  // I know I'm using eval(), too bad.
  return Number(q.answer) === eval(`${q.x} ${q.operator} ${q.y}`)
}