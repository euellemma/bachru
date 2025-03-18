import type {
  Course,
  ExitExam,
  MatricExam,
  Quiz,
  UserReport,
} from "../types.d.ts";

const isBrowser = typeof window !== "undefined";
interface TempState {
  quiz: Quiz;
  report: UserReport;
}

interface PermState {
  userInfo?: {
    gender?: string;
    eduFocus?: string;
    examFocus?: string;
    yearOfStudy?: string;
    dept?: string;
    grade?: string;
    school?: string;
  };
  myCourses?: Course[];
  recCourses?: Course[];
  allCourses?: Course[];
  stars: number;
  qtypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
  };
  quizResults: Array<{ strongTopics: string[]; weakTopics: string[] }>;
  exitExams: ExitExam[];
  exitExamProgress: Record<
    string,
    Record<string, (string | undefined)[]> | undefined
  >;
  matricExams: MatricExam[];
  matricExamProgress: Record<
    string,
    | Record<string, Record<string, (string | undefined)[]> | undefined>
    | undefined
  >;
}

const defaultPermstate: PermState = {
  userInfo: {},
  myCourses: [],
  recCourses: [],
  allCourses: [],
  stars: 0,
  qtypes: {
    multipleChoice: true,
    trueFalse: true,
    shortAnswer: true,
  },
  quizResults: [],

  exitExams: [],
  exitExamProgress: {},
  matricExams: [],
  matricExamProgress: {},
};

// eslint-disable-next-line
export let tempstate = $state<TempState>({
  report: { issue: "" },
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

// eslint-disable-next-line
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
          allCourses: 20,
          quizResults: 20,
          exitExams: 10,
          matricExams: 10,
        }),
      ),
    );
  }
};

export const edit = (editState: Partial<PermState>) => {
  const state =
    JSON.parse(localStorage.getItem("permstate") || "") || defaultPermstate;
  const newState = { ...state, ...editState };
  console.log("the new state is", newState);
  return newState;
  // console.log("the new saved state", newState);
  // localStorage.setItem("permstate", JSON.stringify(newState));
};

export const get = () => $state.snapshot(permstate);
export const getLocal = () =>
  JSON.parse(localStorage.getItem("permstate") || "");

// Function to limit array sizes within an object
export function limitArrays<T>(target: T, filter: Record<string, number>): T {
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

if (isBrowser) {
  (window as unknown as { permstate: PermState }).permstate = permstate;
  (window as unknown as { save: (permstate: PermState) => void }).save = save;
  (window as unknown as { edit: (newState: Partial<PermState>) => void }).edit =
    (window as unknown as { get: () => PermState }).get = get;
  (window as unknown as { getLocal: () => PermState }).getLocal = getLocal;
  console.log("permstate has been set", permstate);
} else {
  console.log("no permstae");
}
