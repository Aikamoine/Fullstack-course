interface CoursePartBase {
  name: string
  exerciseCount: number
  type: string
}

interface CoursePartDescription extends CoursePartBase {
  description: string
}

interface CourseNormalPart extends CoursePartDescription {
  type: 'normal'
}

interface CourseProjectPart extends CoursePartBase {
  type: 'groupProject'
  groupProjectCount: number
}

interface CourseSubmissionPart extends CoursePartDescription {
  type: 'submission'
  exerciseSubmissionLink: string
}

interface CourseSpecialPart extends CoursePartDescription {
  type: 'special'
  requirements: string[]
}

type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart

// this is the new coursePart variable
const courseParts: CoursePart[] = [
  {
    name: 'Fundamentals',
    exerciseCount: 10,
    description: 'This is the leisured course part',
    type: 'normal',
  },
  {
    name: 'Advanced',
    exerciseCount: 7,
    description: 'This is the harded course part',
    type: 'normal',
  },
  {
    name: 'Using props to pass data',
    exerciseCount: 7,
    groupProjectCount: 3,
    type: 'groupProject',
  },
  {
    name: 'Deeper type usage',
    exerciseCount: 14,
    description: 'Confusing description',
    exerciseSubmissionLink: 'https://fake-exercise-submit.made-up-url.dev',
    type: 'submission',
  },
  {
    name: 'Backend development',
    exerciseCount: 21,
    description: 'Typing the backend',
    requirements: ['nodejs', 'jest'],
    type: 'special',
  },
]

const Header = ({ name }: { name: string }) => {
  return <h2>{name}</h2>
}

const Part = ({ part }: { part: CoursePart }) => {
  let content
  switch (part.type) {
    case 'normal':
      content = (
        <div>
          <div>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </div>
          <i>{part.description}</i>
        </div>
      )
      break
    case 'groupProject':
      content = (
        <div>
          <div>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </div>
          project exercises {part.groupProjectCount}
        </div>
      )
      break
    case 'submission':
      content = (
        <div>
          <div>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </div>
          <div><i>{part.description}</i></div>
          <div>submit to {part.exerciseSubmissionLink}</div>
        </div>
      )
      break
    case 'special':
      content = (
        <div>
          <div>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </div>
          <div><i>{part.description}</i></div>
          <div>
            required skills: { part.requirements.join(', ') }
          </div>
        </div>
      )
      break
    default:
      content = <></>
  }
  
  return (
    <div key={part.name}>
      {content}
      <p></p>
    </div>
  )
}

const Content = ({ parts }: { parts: CoursePart[] }) => {
  return (
    <div>
      {parts.map((p) => (
        <Part key={p.name} part={p} />
      ))}
    </div>
  )
}

const Total = ({ parts }: { parts: CoursePart[] }) => {
  return <div>Number of exercises: {parts.reduce((p, c) => p + c.exerciseCount, 0)}</div>
}

const App = () => {
  const courseName = 'Half Stack application development'
  /*
  const courseParts = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
    },
  ]
  */

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </div>
  )
}

export default App
