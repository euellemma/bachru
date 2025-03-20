// outdated! do not follow this instruction

Generate a reference.md file for an app screen based on the Svelte code I provide. Structure it with these sections:

- **Goal**: Concise purpose of the screen
- **API Functions and State**: List of API functions called and state variables used
- **UI Description**: Clear breakdown of UI components and their functionality; make sure to spend time here providing max details and be extensive
- **Navigation**: Outgoing navigation paths with context
- **Special Notes**: Important implementation details or edge cases
- **TODO**: Actionable checklist `[ ]` of pending items for this screen

I'll provide the relevant Svelte component code along with state management and global type declarations to give you full context.

// src/types.d.ts || The global type declarations file
```svelte
type EduFocus = "highschool" | "undergrad" | "exitexam";

type Qtype = "choice" | "tf" | "workout";
interface Quiz {
  questions: Question[];
  focus: "matric" | "normal" | "exitexam";

  examId: string;
  courses: string[];
  chapters: string[];
  subjectId: string;

  courseId: string;
  topics: string[];
  qtypes: QType[];

  timeTook?: number;
}

interface MatricExam {
  examId: string;
  examTitle: string;
  tags?: string[];

  examType: "matric";
  stream: "social" | "natural";
  subjects: Array<{
    subjectId: string;
    subjectTitle: string;
    duration: number;
    totalQuestions: number;
    totalMarks: number;
    chapters: {
      chapterId: string;
      chapterTitle: string;
      description: string;
      questionCount: number;
      gradeGroup: "g9-10" | "g11-12";
    }[];
  }>;
}
interface ExitExam {
  examId: string;
  examTitle: string;
  tags?: string[];

  examType: "exitexam";
  dept: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  courses: Array<{
    courseId: string;
    courseTitle: string;
    questionCount: number;
  }>;
}

interface Question {
  metadata: {
    questionId: string;
    examId?: string;

    courseId: string;
    courseTitle: string;
    chapterTitle: string;
    chapterId: string;
    grade?: string;
    topic: { title: string; filename: string };

    difficulty: number;
    questionType: "multiple-choice" | "true-false" | "workout";
    subType?: "mathematical" | "conceptual";
    src: string;
    confidence: number;
    confidenceRemark: string;
    correctAnswer: string | null;
  };
  hint: string;
  solution: string;
  question: string;
  options: string[];
  isUserCorrect?: boolean;
  isAnswered?: boolean;
}

interface Topic {
  title: string;
  filename: string;
  paragraphs: number;
  pageStart: number;
  pageEnd: number;
}

interface Chapter {
  title: string;
  filename: string;
  pageStart: number;
  pageEnd: number;
  topics: Topic[];
}

type Outline = Chapter[];

interface Course {
  courseId: string;
  courseTitle: string;
  emoji: string;
  isHighschool: boolean;
  isExitCore: boolean;
  grade: string;
  fields: string[];

  showMenu?: boolean;
}

interface TopicData {
  difficulty: number;
  duration: number;
  bloomsLevels: string[];
  flexibility: string;
  confidence: number;
  confidenceRemark: string;
  pageStart: number;
  pageEnd: number;
  funfacts: string[];
  youtubeKeywords: string;
  videos: Array<{
    videoId: string;
    videoTitle: string;
    channelTitle: string;
    thumbnails: string[];
    duration: string;
  }>;
  slides: Array<{
    slideTitle: string;
    slideContent: string;
  }>;

  nextTopic?: { title: string; filename: string };
  prevTopic?: { title: string; filename: string };
}
```

src/lib/state.svelte.ts || The state management svelte file
```ts
const isBrowser = typeof window !== "undefined";
interface TempState {
  quiz: Quiz;
}

interface PermState {
  userInfo?: {
    gender?: string;
    eduFocus?: string;
    yearOfStudy?: string;
    dept?: string;
    grade?: string;
    school?: string;

    myCourses?: Course[];
    recCourses?: Course[];
  };
  stars: number;
  qtypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
  };
  outlines: Array<{ courseId: string; outline: Outline }>;
  quizResults: Array<{ strongTopics: string[]; weakTopics: string[] }>;
  exitExams: ExitExam[];
  exitExamProgress: Record<
    string,
    Record<string, (string | undefined)[]> | undefined
  >;
  matrics: MatricExam[];
  matricProgress: Record<
    string,
    | Record<string, Record<string, (string | undefined)[]> | undefined>
    | undefined
  >;
}

const defaultPermstate = {
  userInfo: { myCourses: [], recCourses: [], topicStrength: {} },
  stars: 0,
  qtypes: {
    multipleChoice: true,
    trueFalse: true,
    shortAnswer: true,
  },
  outlines: [],
  quizResults: [],
  exitExams: [],
  examExamProgress: {},
};

// Initial state declarations with $state
export let tempstate = $state<TempState>({
  quiz: {
    courseId: "",
    focus: "normal",
    examId: "",
    subjectId: "",
    chapters: [],
    courses: [],
    topics: [],
    qtypes: [],
    questions: [],
  },
});

export let permstate = $state<PermState>(
  (() => {
    if (isBrowser) {
      try {
        return (
          JSON.parse(localStorage.getItem("permstate") || "") ||
          defaultPermstate
        );
      } catch (err: unknown) {
        console.log("no state", err);
        return defaultPermstate;
      }
    }
    return defaultPermstate;
  })(),
);

export const save = (state: PermState) => {
  if (isBrowser) {
    console.log("the state to be saved", $state.snapshot(state));
    localStorage.setItem(
      "permstate",
      JSON.stringify(
        limitArrays(state, {
          outlines: 5,
          quizResults: 20,
          exitExams: 10,
          matricExams: 10,
        }),
      ),
    );
  }
};

// Function to limit array sizes within an object
export function limitArrays<T extends Record<string, unknown>>(
  target: T,
  filter: Record<string, number>,
): T {
  const output = { ...target } as Record<string, unknown>;

  for (const key in filter) {
    if (key in filter) {
      const maxSize = filter[key];
      const targetValue = key in output ? output[key] : [];

      if (Array.isArray(targetValue) && maxSize > 0) {
        output[key] = targetValue.slice(0, maxSize);
      } else if (!(key in output)) {
        output[key] = [];
      }
    }
  }

  return output as T;
}
```
------------------------------
I will provide the code for the screen below; after that provide content of the reference.md file directly without pre-fluff
