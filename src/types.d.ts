export type EduFocus = "highschool" | "undergrad" | "exitexam";

export interface UserReport {
  question?: { questionId?: string; questionText: string };
  topic?: { courseId: string; title: string; filename: string };
  issue: string;
}

export type Qtype = "choice" | "tf" | "workout";
export interface Quiz {
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

export interface MatricExam {
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
export interface ExitExam {
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

export interface Question {
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

export interface Topic {
  title: string;
  filename: string;
  paragraphs: number;
  pageStart: number;
  pageEnd: number;
}

export interface Chapter {
  title: string;
  filename: string;
  pageStart: number;
  pageEnd: number;
  topics: Topic[];
}

export type Outline = Chapter[];

export interface Course {
  courseId: string;
  courseTitle: string;
  emoji: string;
  isHighschool: boolean;
  isExitCore: boolean;
  grade: string;
  fields: string[];

  showMenu?: boolean;
  outline?: Outline;
}

export interface TopicData {
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
