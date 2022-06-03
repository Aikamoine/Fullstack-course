const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) => {
    const all = parts.reduce((i, y) => i + y.exercises, 0)

    return (
        < p > total of {all} exercises</p >
    )

}

const Content = ({ parts }) =>
    <>
        {parts.map(part =>
            <p key={part.id}>{part.name} {part.exercises}</p>
        )}
    </>

const Course = ({ course }) => {
    return (
        <>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}

export default Course