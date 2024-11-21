import React from "react";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartWithDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </div>
  );
};

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => <h1>{name}</h1>;

interface ContentProps {
  parts: CoursePart[];
}

const Content: React.FC<ContentProps> = ({ parts }) => (
  <div>
    {parts.map((part, index) => (
      <Part key={index} part={part} />
    ))}
  </div>
);

const Part: React.FC<{ part: CoursePart }> = ({ part }) => {
  switch (part.kind) {
    case 'basic':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          <i>{part.description}</i>
        </p>
      );
    case 'group':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case 'background':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          <i>{part.description}</i>
          <br />
          submit to <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
        </p>
      );
    case 'special':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          <i>{part.description}</i>
          <br />
          required skills: {part.requirements.join(', ')}
        </p>
      );
    default:
      return assertNever(part);
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface TotalProps {
  parts: CoursePart[];
}

const Total: React.FC<TotalProps> = ({ parts }) => (
  <p>
    Number of exercises:{" "}
    {parts.reduce((sum, part) => sum + part.exerciseCount, 0)}
  </p>
);

export default App;
