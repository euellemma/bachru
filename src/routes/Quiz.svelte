<script lang="ts">
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { tempstate, permstate, save } from "$lib/state.svelte";
  import Question from "$lib/mycomps/Question.svelte";
  import { location } from "svelte-spa-router";

  let currentQuestionIndex = $state(parseInt(params.index) || 0);

  const { params } = $props();

  console.log(
    "the quiz given to me",
    JSON.stringify($state.snapshot(tempstate.quiz), null, 2),
  );

  let currentProgress = $state(0);
  let showSolution = $state(false);
  let selectedAnswer: string | null = $state(null);

  let isCorrect: boolean | null = $state(null);
  let solution: string = $state("");

  let seconds = $state(0);
  let timerInterval: number | null = $state(null);
  let isPaused = $state(false);

  function startTimer() {
    if (timerInterval) return; // Don't start if already running
    timerInterval = setInterval(() => {
      if (!isPaused) {
        seconds++;
      }
    }, 1000);
  }
  const showAnswerForWorkout = () => {
    showSolution = true;
    tempstate.quiz.questions[currentQuestionIndex].isAnswered = true;
  };

  onMount(() => {
    updateProgress();
    startTimer();

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  });

  function updateProgress() {
    currentProgress =
      ((currentQuestionIndex + 1) / tempstate.quiz.questions.length) * 100;
  }

  function handleAnswerSelect(answer: string) {
    selectedAnswer = answer;
    const currentQuestion = tempstate.quiz.questions[currentQuestionIndex];
    isCorrect = answer == currentQuestion.metadata.correctAnswer;
    solution = currentQuestion.solution;
    showSolution = true;
    tempstate.quiz.questions[currentQuestionIndex].isUserCorrect = isCorrect;
    tempstate.quiz.questions[currentQuestionIndex].userAnswer = answer;
    tempstate.quiz.questions[currentQuestionIndex].isAnswered = true; // Mark question as answered
    isPaused = true;

    setTimeout(() => {
      const solutionElement = document.getElementById("solution");
      if (solutionElement) {
        solutionElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }

  async function handleWorkoutAnswer(gotItRight: boolean) {
    showSolution = true;
    isCorrect = gotItRight;
    tempstate.quiz.questions[currentQuestionIndex].isUserCorrect = gotItRight;
    tempstate.quiz.questions[currentQuestionIndex].isAnswered = true; // Mark workout question as answered
    solution = tempstate.quiz.questions[currentQuestionIndex].solution;
    isPaused = true;
    handleNext();
  }

  function goBack() {
    window.history.back();
  }

  function handleDone() {
    // Remove unanswered questions from the quiz
    tempstate.quiz.questions = tempstate.quiz.questions.filter(
      (question) => question.isAnswered,
    );

    finishQuiz();
  }

  // instead of adding just the topic file names make it like courseId:filename; you can access courseId from question.courseId
  //
  function createStudyPlan() {
    const topicCounts = tempstate.quiz.questions.reduce((acc, question) => {
      if (question.isAnswered && question.metadata.topic) {
        const topic = question.metadata.topic.filename;
        acc[topic] = acc[topic] || {
          correct: 0,
          total: 0,
          title: question.metadata.topic.title,
          courseId: question.metadata.courseId,
          courseTitle: question.metadata.courseTitle,
          grade: question.metadata.grade,
          chapterTitle: question.metadata.chapterTitle,
          chapterFilename: question.metadata.chapterFilename,
        };
        acc[topic].total++;
        if (question.isUserCorrect) acc[topic].correct++;
      }
      return acc;
    }, {});

    const strongTopics = [];
    const weakTopics = [];
    Object.entries(topicCounts).forEach(([topicFilename, stats]) => {
      const topicObj = {
        filename: topicFilename,
        courseId: stats.courseId,
        courseTitle: stats.courseTitle,
        title: stats.title,
        chapterTitle: stats.chapterTitle,
        chapterFilename: stats.chapterFilename,
      };
      const correctPercentage = stats.correct / stats.total;
      if (correctPercentage >= 0.7) {
        strongTopics.push({
          ...topicObj,
          total: stats.total,
          percentage: correctPercentage,
        });
      } else {
        weakTopics.push({
          ...topicObj,
          total: stats.total,
          percentage: correctPercentage,
        });
      }
    });

    // Sort weak topics by ascending percentage (worst performance first)
    weakTopics.sort((a, b) => a.percentage - b.percentage);

    // Sort strong topics by descending total number of questions (most questions first)
    strongTopics.sort((a, b) => b.total - a.total);

    // Convert back to the expected format, including title in the output
    return {
      strongTopics: strongTopics.map(
        ({
          filename,
          courseId,
          title,
          courseTitle,
          chapterTitle,
          chapterFilename,
        }) => ({
          filename,
          courseId,
          title,
          courseTitle,
          chapterTitle,
          chapterFilename,
        }),
      ),
      weakTopics: weakTopics.map(
        ({
          filename,
          courseId,
          title,
          courseTitle,
          chapterTitle,
          chapterFilename,
        }) => ({
          filename,
          courseId,
          title,
          courseTitle,
          chapterTitle,
          chapterFilename,
        }),
      ),
    };
  }

  function finishQuiz() {
    if (timerInterval) clearInterval(timerInterval);
    tempstate.quiz.timeTook = seconds;

    // for quiz; think for exit and matric
    permstate.quizResults = [createStudyPlan(), ...permstate.quizResults];

    permstate.stars =
      (permstate.stars || 0) +
      tempstate.quiz.questions.filter(({ isUserCorrect }) => isUserCorrect)
        .length *
        5;
    save(permstate);
    push("/post-quiz");
  }

  function handleNext() {
    if (currentQuestionIndex >= tempstate.quiz.questions.length - 1) {
      finishQuiz();
      return;
    }
    const nextIndex = currentQuestionIndex + 1;
    selectedAnswer = null;
    showSolution = false;
    isCorrect = null;
    solution = "";
    currentQuestionIndex = nextIndex;
    updateProgress();
    isPaused = false;
    push(`/quiz/${nextIndex}`);
  }

  function getQuestionOptions(question: Question) {
    if (question.metadata.questionType === "multiple-choice") {
      // Use the options property directly
      return question.options.map((text, index) => {
        return { value: index, text };
      });
    } else if (question.metadata.questionType === "true-false") {
      return [
        { value: "true", text: "True" },
        { value: "false", text: "False" },
      ];
    }
    return [];
  }

  function report() {
    tempstate.report.question = {
      questionId: tempstate.quiz.questions[currentQuestionIndex].question.id,
      questionText: tempstate.quiz.questions[currentQuestionIndex].question,
    };
    push("/report");
  }

  $effect(() => {
    if ($location) {
      const match = $location.match(/\/quiz\/(\d+)$/);
      if (match && match[1]) {
        const newIndex = parseInt(match[1]);
        if (!isNaN(newIndex) && newIndex !== currentQuestionIndex) {
          currentQuestionIndex = newIndex;
          selectedAnswer = null;
          showSolution = false;
          isCorrect = null;
          solution = "";
          updateProgress();
        }
      }
    }
  });

  $effect(() => {
    console.log(
      "Current question: ",
      $state.snapshot(tempstate.quiz.questions[currentQuestionIndex].metadata),
    );
  });
</script>

{#if tempstate.quiz.questions.length > 0}
  <Question
    question={tempstate.quiz.questions[currentQuestionIndex].question}
    options={getQuestionOptions(tempstate.quiz.questions[currentQuestionIndex])}
    solution={solution ||
      tempstate.quiz.questions[currentQuestionIndex].solution}
    hint={tempstate.quiz.questions[currentQuestionIndex]?.hint}
    {showSolution}
    {selectedAnswer}
    {isCorrect}
    {handleAnswerSelect}
    {handleWorkoutAnswer}
    {handleNext}
    {currentProgress}
    {seconds}
    {goBack}
    {currentQuestionIndex}
    {showAnswerForWorkout}
    {handleDone}
    {report}
    questionType={tempstate.quiz.questions[currentQuestionIndex].metadata
      .questionType}
    totalQuestions={tempstate.quiz.questions.length}
  />
{/if}
