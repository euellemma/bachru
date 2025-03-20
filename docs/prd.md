

### 1. Product Overview
- **Name:** Gebi App
- **Purpose:** An exam-focused study app designed to help Ethiopian undergraduate students prepare for their cumulative exit exams using pre-built content referenced from official textbooks.
- **Primary Goal:** To improve exam performance by providing targeted study materials, assessment quizzes, and personalized study plans.

---

### 2. Target Audience
- **Users:** All undergraduate students in Ethiopia across various disciplines.
- **Content Relevance:** Course materials are standardized and aligned with the official curriculum.

---

### 3. Core Features
- **Assessment Quizzes:**
  - Quizzes comprising 5–10 questions, including true/false, multiple choice, and short answer formats.
  - Each question is linked to specific topics for targeted feedback.

- **Content Delivery:**
  - Study materials are delivered as PowerPoint-style slides with content curated from official textbooks.
  - Topic-specific quizzes follow each content module for immediate reinforcement.

- **Personalized Study Plans:**
  - Based on quiz performance, the app generates study recommendations focused on areas needing improvement.
  - Initial rule-based linkage between questions and topics with future possibilities for LLM-driven enhancements.

- **Gamification:**
  - A points system to reward quiz completions and engagement, with potential to expand to badges and other motivators.

- **Notifications & Reporting:**
  - Weekly study reminders (e.g., weekend notifications) to encourage regular engagement.
  - Built-in reporting mechanisms to track performance and progress over time.

---

### 4. Technical Architecture (Typescript is the main language)
- **Frontend:**
  - Aim for lightweight, performant web-app and aside from any libraries listed below try not to add other libraries and even if you seem to want more libraries mention it in your response
  - Built with Svelte5 and shadcn-svelte
  - Vite for building;
  - Svelte Shared State Runes for all kinds of state management; Use local-storage for persistence
  - svelte-spa-router for routing;
  - ky for fetching
  - svelte/transition for transitions
  - lucide svelte for SVG icons
  - Future plans to convert the web app into a mobile app using seamless webview integration.

- **Backend:**
  - Supabase as the primary backend service.
  - Node.js (using Express or Hono) for API endpoints and business logic.

- **Analytics:**
  - Posthog will be used to monitor user engagement, quiz performance, and overall app analytics.

---

### 5. Monetization & Business Model
- **Monetization Strategy:**
  - Users will have access to a short trial period, after which a hard paywall will be implemented to unlock full functionality.

---

### 6. Timeline & Future Considerations
- **Initial Launch:**
  - Focus on core exam preparation features and content delivery.
- **Future Enhancements:**
  - Explore adaptive assessments and advanced LLM integrations for study plan personalization.
  - Consider additional gamification elements and detailed performance metrics based on user feedback.
  - Potential expansion into offline capabilities and broader institutional integrations.

---

### Detailed Description

This exam-focused study app is tailored to empower Ethiopian undergraduate students by providing a comprehensive, curriculum-aligned learning tool. At its core, the app delivers concise, PowerPoint-style study materials derived from official textbooks, immediately reinforced through quizzes containing 5 to 10 varied questions (true/false, multiple choice, and short answer). Each quiz question is meticulously linked to specific topics, enabling the app to generate personalized study plans that pinpoint areas of weakness and suggest targeted content for improvement. The app’s backend is built on Supabase and Node.js, while the frontend leverages Svelte5 and Bits UI, with plans to extend its reach to mobile devices via seamless webview integration. Analytics are powered by Posthog, ensuring detailed insights into user engagement and performance. Additionally, a straightforward gamification system—primarily a points system—motivates consistent study habits, supplemented by weekly reminders to reinforce regular engagement. Initially, the app will operate under a trial period before transitioning to a hard paywall model, ensuring a focused, premium educational experience that can evolve with future integrations of adaptive assessment techniques and advanced LLM enhancements.

---

# Screens and flows:
## Home Page:
Home page with a bottom tabulation of three options;
The bottom tab contents: Home, News Feed, Profile (and Settings)
Rough design includes the courses student takes in list view style, with a section at the bottom with recommendations in scrolling cards style with add buttons to insert into my courses section;
the recommendations will have More button for a dedicated search page for courses
Clicking on the the courses under my courses section will take the user to a Course Page;

## Course Page:
this will have CTAs to take quiz on the topic; open the textbook; and clear assessment;
then it will have a list of assessment;
the assessment will be presented in expandable cards with titles as the Chapter names with subtopics listed in the description before expansion, and after expansion each topic will have a Read section and quiz on topic actions, and options to remove topic (as Finished);
the cards are expanded by default; and it will have an assessment indicator with orange-yellow-green scale with keywords Strong Topic, Okay-ish Topic, Weak Topic;

## Pre Quiz Page:
this is a bunch of pages with a simple title and a bunch of options;
1. Chooce quiz type: multiple choice, true/false, workout/short answer; with multiple selectable with checkboxes and a continue button at bottom;
2. Select Topics: with topics listed grouped by chapters; again multiple selectable with checkboxes and a continue bottom at the top right;

## Quiz Page:
this is the quiz page with a button of hint at the top right and a back bottom at top left;
after the question it will have a Show Answer in the center also it will a Report button after the answer gets shown; also at the end of the question there is a Read Topics section where the user can directly read about the topics of the questions; also after showing answer on workout/short answer questions, it will ask them if they have got it right;

## Post Quiz Page:
one where it shows stars from the quiz and asks the user for more quizzes and or for a study plan, after that it will take the user to Pre Quiz where the previous settings will be saved; but if the user clicks on create a study plan that page will open;

## Study Plan Page
a topic assesment with similar UI to Course Assessment section but only for the quizzes that were taken before;

## Topic Page;
a page that will have a course content for the topic with options to start a quiz on that topic, or open official module reference, and a fun fact at the start of the section; also a report/feedback button to send feedback on the content;

## News Feed Page;
Create a nice coming soon page; with a request to join my Telegram Channel if they're interested;

## Profile/Settings Page;
a simple settings page to change name, gender, focus (exit exam or Gebi Courses), school, field of study, and contact me button;


# Onboarding
=> field(combobox), year (select)
=> school(input), gender(radio)
-educate
-quiz flow
1: exitexam and final/mid

# places of quiz buttons
Course (Start Quiz and Quiz Topic): qtopics -> qtypes
Study Plan (Quiz Topic):            qtopics -> qtypes
Topic (Start Quiz):                 qtopics -> qtypes
Exam (Start Exam and Exam Topic):   qtopics

# progress tracking places:
  weak and strong from study plan
  questions answered from past exams

# api endpoints
-user registration endpoints
/report-feedback
/update-settings



/get-past-exams
  matrix => [2016, 2015, 2014] classified by course  => classified by chapters
  exit => [2016, 2015] classified by course
  idk
  [
    {
      examTitle, examName, subjects: Array({

      }),
      courses:
    }
  ]


/get-exam
  exam-name =>  matric: 2016-eng            | exit: 2016-cs, 2016-model-cs
  course =>     matric: eng                 | exit: datastructures
  qtopics =>    matric: chapter1, chapter2  | exit: introai, datastructures
  : array of question objects

/get-quiz
  qtopics[] qtypes[]
  : array of question objects

/get-courses
  search-keywords
  : [
    { emoji, courseTitle, courseName, fields: Array }
  ]

/get-outline-for-course
  : outline array with strength field

/get-topic-content
  : topic object



*IntroOne*
  -set eduFocus
*IntroTwo*
  -set dept and year :OR
  -set grade
*IntroThree*
  -set gender and school
*IntroFour*
  -add animations

*Home*
  [+] -my courses: (a dedicated api (eduFocus, grade/field) => course with outline[] )
    for high school; get from grade based
    for exit exam; get from field type
    for undergrad; get from year and field and school
      or maybe ask them too;
  [+] -recommendations: (a dedicated api (eduFocus, grade/field) => course with outline[])

  [+] -onclick past exams => open past exams
  [+] -onclick search => open search courses page
  [+] -onclick add button on recs => add the course to permstate
  [+] -more button on courses => open, remove
  [+] componentize the nav bar;

*Course*
  [ ] start-quiz: pushes a new quiz object with course name then calls pre-quiz
  [ ] quiz-topic: pushes a new quiz object with course name one topic selected then calls pre-quiz

  [ ] list-topics: flattens the outline then lists them; check with local storage for strength
  [ ] read-topic: push course & topic filename then the topic page fetches it

so whats a quiz?
  -course, topics, qtypes => array of questions
what about an exam?
  -eduFocus, examname/school, courses/subjects, topics/chapters
    matric: qsrc (examname); course (subject); topics (chapters)
    exitexam: qsrc(examname); courses
    undergrad: qsrc(school); courses; topics


*Topic*
  [+] -update topic prompt and gen new topic docs
  [+] -new design
  [ ] -implement functionality
        [/] -next/prev topics
        [ ] -image parssing (update agent first)
        [ ] -katex and highlight.js inclusion
        [/] -report mechanisms
        [ ] -quiz starting

*SelectTopics*
*QuestType*
*Quiz*
*PostQuiz*
*StudyPlan*

*PastExams*
*ExamSubjects*
  card-click: open exam page with subject for matric

*Exam*
  start-exam:
  list-classified:
  read-chapter/read-course: open course

*SearchCourse*
*News*
*Settings*
*Module*
*Report*
