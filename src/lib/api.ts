import type { Course, EduFocus, TopicData } from "../types.d.ts";
import { mockCourses, mockMatricExams, mockQuizQuestions } from "./mock";
export async function reportFeedback(feedback: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 3500));
  console.log("report feedback got called man the feedback is this", feedback);
}

export async function getCourses(query: string = ""): Promise<Course[]> {
  const lowerQuery = query.toLowerCase();
  return mockCourses.filter(
    (course) =>
      course.courseTitle.toLowerCase().includes(lowerQuery) ||
      course.fields.some((field) => field.toLowerCase().includes(lowerQuery)),
  );
}

import { outline } from "./mock";
export async function getCourse(courseId: string): Promise<{ data: Course }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("get course got called man the outline is this", outline);
  try {
    return {
      data: {
        courseId,
        courseTitle: "Logic and Critical Thinking",
        outline: outline,
      } as Course,
    };
  } catch (error) {
    console.error("Error reading or parsing course outline:", error);
    return null as unknown as { data: Course };
  }
}

export async function getCourseForEduFocus(
  eduFocus: EduFocus,
  deptOrGrade: string,
): Promise<{ data: Course[] }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (eduFocus === "undergrad") {
    return { data: [] };
  }

  if (eduFocus === "highschool") {
    return {
      data: mockCourses
        .filter((course) => course.isHighschool && course.grade === deptOrGrade)
        .map((course) => ({ ...course, outline })),
    };
  }

  if (eduFocus === "exitexam") {
    return {
      data: mockCourses
        .filter(
          (course) => course.isExitCore && course.fields.includes(deptOrGrade),
        )
        .map((course) => ({ ...course, outline })),
    };
  }

  return { data: [] };
}

export async function requestCourse(courseName: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`User requested to add course: ${courseName}`);
  // In a real implementation, this would make an API call to save the course
  // For now, we'll just simulate a successful operation
  return true;
}

export async function searchCourses(
  query: string = "",
  eduFocus: EduFocus | "" = "",
  limit: number = 20,
): Promise<{ data: Course[] }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const lowerQuery = query.toLowerCase();

  let filteredCourses = mockCourses;

  // Filter by eduFocus first
  if (eduFocus === "highschool") {
    filteredCourses = mockCourses.filter((course) => course.isHighschool);
  } else if (eduFocus === "undergrad" || eduFocus === "exitexam") {
    filteredCourses = mockCourses.filter((course) => !course.isHighschool);
  }

  // If query is empty, return all courses matching the eduFocus filter
  if (query === "") {
    return { data: filteredCourses.slice(0, limit) };
  }

  // Apply query filter
  filteredCourses = filteredCourses.filter(
    (course) =>
      course.courseTitle.toLowerCase().includes(lowerQuery) ||
      course.fields.some((field) => field.toLowerCase().includes(lowerQuery)),
  );

  return { data: filteredCourses.slice(0, limit) };
}

import topicData from "../../modules/freshman/logic/topics/axiology-logic.json";
export async function getTopicData(
  courseId: string,
  filename: string,
): Promise<{ data: TopicData }> {
  console.log(`giving topic data for ${courseId}/${filename}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    return { data: topicData };
  } catch (error) {
    console.error("Error reading or parsing course outline:", error);
    return { data: {} as TopicData };
  }
}

export async function getMainCourses(eduFocus: EduFocus, fieldOrGrade: string) {
  console.log("ok man", eduFocus, fieldOrGrade);
  if (eduFocus == "undergrad") {
    return { data: [] };
  }
  if (eduFocus == "highschool") {
    return {
      data: mockCourses
        .filter((course) => course.isHighschool && course.grade == fieldOrGrade)
        .map((course) => ({ ...course, outline })),
    };
  }
  if (eduFocus == "exitexam") {
    return {
      data: mockCourses
        .filter(
          (course) => course.isExitCore && course.fields.includes(fieldOrGrade),
        )
        .map((course) => ({ ...course, outline })),
    };
  }
}
export async function getRecCourses(eduFocus: EduFocus, fieldOrGrade: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (eduFocus == "highschool")
    return { data: mockCourses.map((course) => ({ ...course, outline })) };
  if (eduFocus == "exitexam" || eduFocus == "undergrad")
    return {
      data: mockCourses
        .filter((course) => course.fields.includes(fieldOrGrade))
        .map((course) => ({ ...course, outline })),
    };
}
export async function getQuizQuestions() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockQuizQuestions };
}
export async function getExitQuestions() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockQuizQuestions };
}

import { mockExitExam, mockExitExams, mockMatricExam } from "./mock";
export async function getExitExam() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockExitExam };
}

export async function getExitExams() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockExitExams };
}

export async function getMatricExam(examId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log("fetching matric exam for id:", examId);
  return { data: mockMatricExam };
}

export async function getMatricExams() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockMatricExams };
}
