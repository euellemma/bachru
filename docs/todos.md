# misc (ignore for now, there are for the far future)
-in select-topics outline should be found in cache
-when searching also search through their grade also, also have something like a tag searching prop in courses object
  so that a grade 10 student can search for grade 11 or 9 or uni courses
-in qtypes save the user preference in permstate

# quiz flow
eg: from topic page clicks on quiz
-> create a quiz object
-> calls select-topics with quiz id
-> select topics looks for courseId then after selected topics it adds to the quiz object in tempstate
-> calls qtypes page with quiz-id, fills the qtypes object then
-> calls quiz with quizzid
... more step to be shown latters

# quiz generator
-> read outline from course-id
-> create a quizzes folder, quiz-progres.json for tracking progress
-> for each topic on in the outline it extracts the content from textbook-clean file
-> calls model to check for the number of questions for each question type; total being 50; so maybe 30 for choice, 10 true false and 10 workout
-> calls the model again to generate the quizzes in batch; eg: 30 for choice = 1 call, 10 true/false = 1 call and so on
-> write the output in topics-filename.json in quizzes folder
when creating this agent look into agents folder for agent-utils.ts file for utils and how i implement agents in the other folder

# quiz.svelte page
-> first implement a mock api in api.ts by using ./modules/freshman/logic/quizzes/mean-nature-phil.json as you data source;
    just randomly provide 10 questions; 5 choice, 3 true/false and 2 workout in the mock api function; first look into the json file to understand data structure; you can look into types.d.ts for types
-> the quiz page will be given with a quizId so it will fetch for the API by inputtin the quiz object
-> implement every functionality in the quiz page
more features
  [-] skip, then comes last;
  [-] save questions
  [-] disable timer in qtypes?
  [-] question difficulty
  [+] back to previous quiz
  [ ] error handlings - first ask the AI
  [ ] implement report button

# more general direction for march-10
[+] rewrite the state handling function to make it hella simpler
  [+] Topic.svelte
  [+] SelectTopics.svelte
  [+] Quiz.svelte
  [+] QuestType.svelte
  [+] Home.svelte
  [+] Course.svelte

[ ] continue with post-quiz, study-plan and more
[ ] $state.snapshot in questtype and select topics too and topic page too

# areas of the project
-agent
-frontend
-api & mock
-data src and types


*Course*
  [ ] start-quiz: pushes a new quiz object with course name then calls pre-quiz
  [ ] quiz-topic: pushes a new quiz object with course name one topic selected then calls pre-quiz

  [ ] list-topics: flattens the outline then lists them; check with local storage for strength
  [ ] read-topic: push course & topic filename then the topic page fetches it

*PostQuiz*
  [ ] brainstorm steps
*StudyPlan*
  [ ] brainstorm steps
  [ ] fetch the outline from the cache too
*SelectTopics*
  [ ] brainstorm steps
  [ ] fetch the outline from the cache
  [ ] default selected topics is from quizId
*QuestType*
  [ ] brainstorm steps
  [ ] remember from the past their choice


*PastExams*
  [ ] brainstorm steps
*ExamSubjects*
  card-click: open exam page with subject for matric
*Exam*
  start-exam:
  list-classified:
  read-chapter/read-course: open course
  what about an exam?
    -eduFocus, examname/school, courses/subjects, topics/chapters
      matric: qsrc (examname); course (subject); topics (chapters)
      exitexam: qsrc(examname); courses
      undergrad: qsrc(school); courses; topics

*Report*
  [ ] brainstorm steps
*Settings*
  [ ] brainstorm steps
*SearchCourse*
  [ ] brainstorm steps

*misc*
  [ ] what things should be cached
  [ ] read topic option in quiz page

exam jema;
quiz and plan jema;

# finish up quiz flow
  [+] fix the proxy shit in quiz
  [+] understand the codebase of quiz
  [+] implement post quiz functionality of stats
  [+] brainstorm how "More Questions" will work

// Read; Quiz Topic

# next steps for march-10 afternoon
* first take care of study plan page and finsih up quiz flow for good
  [+] where does close in post-quiz goes (goes back to history until it gets to main)
  [+] brainstorm steps for create study plan
    [+] make UI consistent with Course.svelte
    [+] the datatype and storage of strength

# next steps for march-11 afternoon
[+] calculate and store stars
[ ] plan your exam implmemntation for cursor
[ ] question.topic should be changed from string to object with filename and title everywhere

* second take care of reporting
* then update topic and course and quiz and everywhere related to reporting

* then take care of course page
* then take care of home page (TAKE CARE OF THE ERROR THAT WHEN SELECTING GRADE 10 I GOT NO COURSES FOR MINE; AND ALSO AFTER I ADDED, IT DIDNT UPDATE IMMEDIATELY BUT DID AFTER IT WAS REFRESHED; think of implementing an LLM generated qa or frontend or functionality testing from the LLM after it scan the whole codebase; and also in the checklist including situations where it gives me to test a scenario when i guessed how a bug in the codebase might affect the user experience) and searching of courses and recommendation of courses logic


# [ ] update the concerned pages with the cached logic

# before going to exam
  [+] review exam parser
  [+] update types based on review

# implementing exam;
  [+] based on the choices SelectTopics and StudyPlan will have different UI and logic
  [+] so first i will give you how exitexam, matrix and quiz differ from each other

no select topics for matric
only select courses for exitexam
studyplan: course + topic (without chapters) for exitexam
studyplan: chapter + topic (with grade differentiator) for matric

outline for normalquiz is topics under chapternames for a courseId (fetch outline from local)
= translate topic array to chapter + segment topic array;
  input: raw topic array, course outline


outline for matric exam page is chapter names tabbed by grade group
outline for study plan is topics grouped under chapter names tabbed by grade group
= translate topic array to chapter + grade group + segmented topic arrays for each chapter
  inputs: raw topic arrays, matric exam outline for that examId; (so each chapter should have topics array in the matric exam outline)
it needs course outline for all grade levels

outline for exitexam page is plain courses list;
outline for study plan is topics groupped under course names;
= translate topics array to course + topic group;
  inputs: raw topics array, exitexam outline for that examId; (so each course should have topics array; this might be in the exitexam outline or from courses of the student)

but the course outline for highschool classes is different ig?

# some ideas
[ ] why store each limited savable arrays?
    [ ] outlines: when course opens
    [ ] quizResults: when course opens, for study plan
    [ ] exitExams: when exampage opens, for select-courses,  maybe for exitexamlist
    [ ] matricExams: when exampage opens, maybe for matriclist
[ ] exitexam object will also embed the outline; or the isExitCore course outlines should always be stored locally
[ ] topic file names should be unique across everywhere

[+] matric page: take from Exam.svelte add tabs like StudyPlan tabs being 9&10 11&12;
[+] exit page: copy Exam.svelte and just change up the names;


mock datas
  [ ] exitexam outline
  [ ] exitexam questions with the new prompt
  [ ] matric outline
  [ ] matric questions with the new prompt

# next steps for mar-14
[ ] exitexam list page
[ ] matric list page
[ ] matric subjects page
[ ] continue with the home page path

understand quiz

# agent
-gen-quiz and parse-matric and parse-exitexam should match types.d.ts


# reference files
[+] Course
[+] ExitExam
[+] PostQuiz
[+] Quiz
[+] StudyPlan
[+] SelectCourses
[+] Topic
[+] Settings
[+] News
[+] Home
[+] Report
[+] SelectTopics
[+] QuestType
[+] PastExams
[+] Intros
[+] SearchCourses
[+] MatricSubjects

# march 15 reviewing
[+] Course
[+] Topic
[+] Home
[+] Report -> Quiz page reporting
[+] MatricSubjects
[+] ExitExam
[+] MatricExam
[+] Past Exams
[+] Intros (fetch my courses)
[+] Settings (fix the re-fetching of courses especially think about exitexam course refetching from undergrad eduFocus perspective)

# onboarding quiz flow
[+] I'm on StudyPlan lay on onboarding-quiz-flow
[/] lets also recheck 'More Questions' logic
[ ] create study plan for matric in Quiz.svelte

# first course list;
high school - search through all courses with the default
undergrad - search through all courses with arbitrary listed first
exitexam - search through all courses with the default

highschool - fixed courses
undergrad - empty slate
exitexam - fixed courses

[ ] matric flow is not tested yet
[ ] backend
[ ] topic; image + code + math
[ ] pwa
