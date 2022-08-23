export interface QuestionParameters {
  x: number
  y: number
  operator: '+' | '-' | '*' | '/' | ''
  question?: string
  answer?: string
}

const generateNewQuestion = (): QuestionParameters => {
  let newQuestion: QuestionParameters = {
    x: Math.floor(Math.random() * 10) + 1,
    y: Math.floor(Math.random() * 10) + 1,
    operator: Math.random() > 0.5 ? '+' : Math.random() > 0.5 ? '-' : '*',
    answer: ''
  }
  newQuestion.question = `${newQuestion.x} ${newQuestion.operator} ${newQuestion.y} = ?`
  return newQuestion
}

const answerHandler = (q: QuestionParameters): boolean => {
  return Number(q.answer) === eval(`${q.x} ${q.operator} ${q.y}`)
}

export { generateNewQuestion, answerHandler }
