<script>
  import { Toaster } from "svelte-sonner";
  import Router from "svelte-spa-router";
  import Home from "./routes/Home.svelte";
  import Course from "./routes/Course.svelte";
  import Topic from "./routes/Topic.svelte";
  import QuestType from "./routes/QuestType.svelte";
  import SelectTopics from "./routes/SelectTopics.svelte";
  import Quiz from "./routes/Quiz.svelte";
  import PostQuiz from "./routes/PostQuiz.svelte";
  import StudyPlan from "./routes/StudyPlan.svelte";
  import Module from "./routes/Module.svelte";
  import Report from "./routes/Report.svelte";
  import News from "./routes/News.svelte";
  import Settings from "./routes/Settings.svelte";
  import PastExams from "./routes/PastExams.svelte";
  import Exitexam from "./routes/Exitexam.svelte";
  import IntroOne from "./routes/IntroOne.svelte";
  import IntroTwo from "./routes/IntroTwo.svelte";
  import IntroThree from "./routes/IntroThree.svelte";
  import IntroFour from "./routes/IntroFour.svelte";
  import MatricSubjects from "./routes/MatricSubjects.svelte";
  import MainScreen from "./routes/MainScreen.svelte";
  import Matric from "./routes/Matric.svelte";
  import SelectCourses from "./routes/SelectCourses.svelte";

  const routes = {
    "/home": Home,
    "/course/:courseId": Course,
    "/topic/:courseId/:filename": Topic,
    "/quest-type": QuestType,
    "/select-topics": SelectTopics,
    "/select-courses": SelectCourses,
    "/quiz/:index": Quiz,
    "/post-quiz": PostQuiz,
    "/study-plan": StudyPlan,
    "/module": Module,
    "/report": Report,
    "/news": News,
    "/settings": Settings,
    "/intro-one": IntroOne,
    "/intro-two": IntroTwo,
    "/intro-three": IntroThree,
    "/intro-four": IntroFour,

    "/past-exams": PastExams,
    "/matric-subjects/:examId": MatricSubjects,
    "/matric/:examId/:subjectId": Matric,
    "/exitexam/:examId": Exitexam,
    "/main": MainScreen,
  };
</script>

<Toaster theme="dark" />
<Router {routes} />
