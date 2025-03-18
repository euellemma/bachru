
googleaistudeokey = AIzaSyB8PHWafA078UG1aq4JvSI7-afiIT7Io2M
geminiaistudeokeyhana = AIzaSyAnC3ptwWNPzlpnzATVsKNC-sFpo0FMtSk

# when writing documents; make sure to do an intro for each Section object;
# dont forget to check for filename duplicates in the outline;
# dont ever make the student feel stupid, tnsh echin kanebebsh beka pis nw; esti let's try this one
# dont forget a reporting mechanism
# you should think of exam multipiers

# these are some contents that can be omitted in the outline so look out when creating the file output;
Content to Consider Omitting:
1. Review questions/summaries at chapter ends
2. Self-assessment quizzes
3. Learning objectives listings
4. Glossary sections
5. References/bibliography sections
6. Historical sidebars/boxes
7. "Further Reading" sections
8. Online resource links
9. Appendices with supplementary material
10. "For Advanced Readers" sections

# metadatas
-difficulty from 1 through 10
-estimated duration in minutes
-prerequisites
-bloomsLevel: [remember, understand, apply, analyze, evaluate, create] - [memorize, conceptual, steps, logic, analysis, create],
-flexibility: [must-read, essential, optional]


please clearly isolate responsiblities in system and user prompt, giving more context in the user prompt, and for your questions:
the prerequisites array should be small in number, and there is no need to validate at this state, just prompt it to only focus on metadata generation while not fucking up the existing structure

I am building an agent to convert a textbook PDF to a highly segmented html files based on topics;
the first step is to change the PDF to a big html file with zero styling then to strip every tag except image tags to preserve image info
the reason for i did not just convert it to text file and feed it into the LLM is because i wanted to link the images
then after that is to get an outline from the LLM based on the file, after that recursively going to each topic in it to create an html file with images in the input file
can you write a prompt for me to do the final step; i am expecting an output of something like;
<script type="application/ld+json">{{metadata about topic}}</script>
{{the rest of html content}

the meta data is these infos
- **Difficulty (1-10):** Evaluate based on content complexity relative to the overall course.
- **Duration:** Estimate the reading/understanding time in minutes, considering content length and complexity.
- **BloomsLevels:** Determine one or more applicable levels from: [memorize, conceptual, steps, logic, analysis, create]. Always output these as an array.
- **Flexibility:** Categorize the topic’s importance as one of: [must-read, essential, optional].
before writing the prompt do you have questions for me

It took me a long time to work out why it had been so easy and why this
time I hadn’t suffered those terrifying withdrawal pangs. The reason is that
they do not exist. It is the doubt and uncertainty that cause the pangs. The
beautiful truth is: IT IS EASY TO STOP SMOKING. It is only the
indecision and moping about it that make it difficult. Even while they are
addicted to nicotine, smokers can go for relatively long periods at certain
times in their lives without bothering about it. It is only when you want a
cigarette but can’t have one that you suffer.

-<p>, <div>, and <span> with optionally these class names: "definition", "example", "note (for tips, warnings, importants)"
-class: "math" <div> and <span> for math
-<h1>, <h2>, <h3> for heading and <p> for paragraphes
-<ul>, <ol>, <li>
-<pre><code></code></pre> for code to be highlighted by highlight.js
-<blockquote> for important quotes or callouts
-<strong>, <em>, <u> tag for styling
-<table>, <th>, <tr>, <td> - For tabular data

# image to exams convertor
i am trying to plan an agent that will input images of past exams, and will output structured data of the questions;
the outputs i was thinking are questions, answer with explanation or steps (be extensive if you have to), hint, and metadata about difficulty, questiontype and even the topic;
what else should i consider outputting? please answer briefly

i am trying to plan an agent that will input images of past exams, and will output structured data of the questions;
what i have in mind is something like an HTML that uses KaTeX for math and highlight.js for code;

# course folder structure

## INPUT:
dept1.pdf
dept2.pdf

## OUTPUT:
dept/
  coursename/
    topic1.html
    topic2.html
    img1.jpg
    img2.jpg
    progress.json
    coursename.ot.json

### For Mid/Final contents
## INPUT:
dept/
  bmu-10988537395/
    img1.jpg
    img2.jpg
    img3.jpg
  bmu-10938287493/
    img1.jpg
    img2.jpg
    img3.jpg

## OUTPUT:
dept/
  bmu-10988537395/
    exams.html
    img1.jpg
    img2.jpg
    img3.jpg
  bmu-10938287493/
    exams.html
    img1.jpg
    img2.jpg
    img3.jpg

### For Exit Exam contents
## INPUT:
model1/
  img1.png
  img2.png
model2/
  raw.html
  raw-clean.txt

## OUTPUT:
model1/
  exams.html
  img1.png
  img2.png
model2/
  exams.html
  raw.html
  raw-clean.txt


create a prompt for an agent that extrats exams from a bunch of images taken from past exams;
these images may be incomplete or blurry, or they might have incomplete questions; for that just inform
the model through the prompt to fill the missing parts of question by itself, and with the image the model will be given an outline JSON
of the course topics from which those questions have been extracted; therefore the model will output metadata about each question;
i expect an output something like
<script id="course-metadata" type="application/ld+json">
{ ...metadata JSON...; which includes hint, topic, difficulty (1 through 10), questionType }
</script>
<div id="question-1">
  <div class="question"> </div>
  <div class="options"> {{ which can be ABCD choices or True or False} </div>
  <div class="solution"> </div>
</div>

update on the output structure: the output should be like:
<script id="metadata-1" type="application/ld+json">
{{ ...metadata JSON...}
</script>
<div id="question-1">
{{... question content here ...}
</div>

also the hint should be in the question tag like: <div class="hint"></div>

## img to exam prompt

You are an expert exam question analyzer and reconstructor. Your task is to process images of exam questions, analyze them, and output structured questions with metadata. You must work with the provided course outline JSON to properly categorize questions.

COURSE OUTLINE:
[COURSE_OUTLINE_JSON_PLACEHOLDER]

CORE RESPONSIBILITIES:
1. Process exam question images (single or multiple questions per image)
2. Reconstruct unclear/incomplete questions while maintaining topic relevance
3. Generate structured output with metadata and content
4. Convert questions to supported formats (multiple-choice, true/false, workout/short answer)
5. Map questions to course topics

OUTPUT STRUCTURE:
For each question, generate:

1. Metadata script:
<script id="metadata-{n}" type="application/ld+json">
{
    "id": "string",
    "topics": ["filename1", "filename2"],
    "difficulty": number(1-10),
    "questionType": "multiple-choice" | "true-false" | "workout",
    "originType": "real" | "reconst",
    "imageRefs": ["img1.jpg"], // if needed
    "confidence": number(1-10),
    "confidenceRemark": "string",
    "correctAnswer": "A"|"B"|"C"|"D"|"E"|"True"|"False"|null
}
</script>

2. Question content:
<div id="question-{n}">
    <div class="question-text">...</div>
    <div class="hint">...</div>
    <div class="options">...</div> // if applicable
    <div class="solution">...</div>
</div>

RULES AND GUIDELINES:

1. Question Processing:
- Mark as "real" only if question is completely clear and readable
- Mark as "reconst" if ANY part needs reconstruction
- Maintain topic relevance when reconstructing
- Preserve original difficulty level when determinable
- Convert matching/fill-in-blank to multiple-choice

2. Topic Mapping:
- Map to ALL relevant topics from course outline
- Use topic filenames in metadata
- Include confidence remark if topic mapping is uncertain

3. Content Formatting: ALLOWED HTML ELEMENTS AND USAGE

  Heading Structure:
  <h1> - Main topic title only
  <h2> - Major section divisions
  <h3> - Subsection headings
  Maintain strict hierarchy; no skipping levels

  Content Containers:
  <p> - Standard paragraphs
  <div> and <span> with classes:
  - class="definition" - Formal term definitions
  - class="example" - Illustrative examples
  - class="note" - Tips, important points, warnings

  Mathematical Content:
  <span class="math-inline"> - For inline mathematics
  <div class="math-display"> - For displayed equations
  [Use combination of LaTeX and unicode; ensure proper delimiters]

  Code Sections:
  <pre><code class="language-[name]"> - For code snippets
  [Always specify language; ensure proper formatting]

  List Structures:
  <ul> - Unordered lists (concepts, points)
  <ol> - Ordered lists (steps, procedures)
  <li> - List items
  [Maintain proper nesting for complex multi-level lists; use appropriate type]

  Text Emphasis:
  <strong> - Critical emphasis
  <em> - Secondary emphasis
  <u> - Underlining
  [Use sparingly and meaningfully]

  Special Elements:
  <blockquote> - Significant quotes or key points
  <table>, <th>, <tr>, <td> - Tabular data
  <hr> - Major section breaks

4. Mathematical Content:
- Use KaTeX for mathematical expressions
- Use appropriate math-inline or math-display classes
- Combine with Unicode where appropriate

5. Image References:
- Include imageRefs if diagrams/tables are essential
- Reference images sequentially (img1.jpg, img2.jpg, etc.)
- Reconstruct tables in HTML when possible

EXAMPLES:

1. Clear Multiple Choice Question:
[Example image of a clear question about DFS algorithm]

<script id="metadata-1" type="application/ld+json">
{
    "id": "1",
    "topics": ["dfs", "problem-solving-search"],
    "difficulty": 7,
    "questionType": "multiple-choice",
    "originType": "real",
    "imageRefs": [],
    "confidence": 9,
    "confidenceRemark": "Clear question with direct topic mapping",
    "correctAnswer": "B"
}
</script>
<div id="question-1">
    <div class="question-text">
        Consider the following graph traversal using DFS:
        <div class="math-display">
            [Graph representation in KaTeX]
        </div>
        What is the correct sequence of visited nodes?
    </div>
    <div class="hint">
        Remember that DFS explores as far as possible along each branch before backtracking.
    </div>
    <div class="options">
        <div class="option" data-option="A">1-2-4-3-5</div>
        <div class="option" data-option="B">1-2-3-4-5</div>
        <div class="option" data-option="C">1-3-2-4-5</div>
        <div class="option" data-option="D">1-2-3-5-4</div>
    </div>
    <div class="solution">
        <p>The correct answer is B (1-2-3-4-5). Here's why:</p>
        <ol>
            <li>Starting at node 1</li>
            <li>Following DFS principle, we go deep through the leftmost path first</li>
            <li>This leads us to sequence 1-2-3</li>
            <li>After backtracking, we visit 4 and finally 5</li>
        </ol>
        <p>Alternative approach: You could also verify this by drawing the DFS tree.</p>
    </div>
</div>

VALIDATION REQUIREMENTS:
1. Ensure correctAnswer matches available options
2. Verify topic filenames exist in course outline
3. Confirm difficulty and confidence are 1-10
4. Validate HTML structure matches allowed elements
5. Verify image references when needed
6. Ensure mathematical expressions are properly formatted

When processing new questions:
1. Analyze the image thoroughly
2. Determine question type and reconstruction needs
3. Map to course topics
4. Generate structured output
5. Include detailed solutions with explanations
6. Provide helpful hints
7. Validate all metadata and content

Process the exam questions and output structured data according to these specifications.


getUnprocessedExamFolders(courseRoot)
readAndCleanOutline(courseRoot)
getImgsForFolder(folderName) -- accepts only the folderName from output of getUnprocessedExamFolders and then returns the an array of { inlineData: { data: buffer, mimeType }} for Gemini to process
createExams(cleanOutline, imgList) -- inputs from above two functions then gives it to callGemini function and then outputs the HTML content
writeExam(courseRoot, folderName, htmlContent) -- writes the output to exams.html under folderName under exams folder of the courseRoot folder

# a letter
eshi with tips, because i care for you should read this hawisha, lidu endatsasachibegn echin echin ewekilign;
asayegn ena fetnegn estiii eya CHESSS
( so a screen before topic course to tell me learn this and i will test you eshi hawisha,
  also give her a question then when things look hard give her an option to learn about it,
  also give her hints, and directions, no problem tnsh asebina... (abren enesraw?)
)
keza tedy endeza hone nw melesh hahaha;
(
  so be tedy fanta make it Kebede, Miki, Nati, or Josh or Roba (roba it is tewesnual the boys and even chikochu ywedutal eko) and Beti
)
so be video call asayshalew anchi demo;
(
  live help, hand yezo masayet
)
(
  an argument against points; or no points make hawi happy it also makes lidu happy
  but argument against streaks because no one studies every day,
  maybe a weekend study reminder and a week streak with notifications is a good idea
)
(
  also: interesting facts for Abresh in the app and the intellectuals woowwww
  also: did you know questions before the fun facts and even between screens sometimes in the onboarding
    and start of lesson plans and the start of quizzes
)
esti from start ke basicsuu from the begineerrr asrejign; endeeee hayu baby
* i really shouldve called her lideta eyalen and take her places besmamm;
* call her and go tmrw bezaw meseraw sera yenoral ekahen yezeh hid
and talk business with her too;; haha enesu yetsumu egna mn ageban hahaha

i am a really interesting kid gn enezan hula chikoch zm beye metewew; and that makes me ambitious
and even more attractive to girls; and all of this is because of my mother! the love she gave me;
the love of my mother is my power and fuel for my ambition

(
  tadya lidu mech nw menatenawww eee; slide into her DMs in the trial peroid with a personalized message on how Logic kicked her ass
  and also my username is notrobasorry sorrynotroba
  gn demo echin neger kakomk tetamaleh, so atakuma endewm the virality from your timely checks in nicely stolen from Duo
)
(
  Robertoooo with a malia as the story of my page
  Roba in exams and roba in answer explanations Roba in topic summarie wait...
  Roba betam mebzat yelebatm beka
)
(
  be like Dominate Nur, like That Four Juma, like those girls new jema, like Ethio Trollers, like Ela and the childhood friends
  like Panda (consider to open a Panda branch); even document your life journey wowww, an amazing fan base and series!
  do a build in public on tiktok be it like Dominate! even that kid Beki started it like this just to sell Minoxil
  did you see how Minoxil have added other benefits wowwww
  i see how computer makes my productivity 10x and how AI will make my productivity 100x when competing with iStore;
  funny, my nemesis is iStore haha;
)
my goal is to make a big social experiment too, one of a kind!
even move to Grade 12 students, and later high school for this year;
and that video of first apply is with the tekuru susegna tiktoker
  and those chikoch highschool jema for the matric app
i will take over Ethiopia's education;
i have won this system once and i will win it again in an even more marvelous way,
i am a teacher's son right, i will make mama proud with this one!
(
  eee brother first apply tignalesh migerm chewe nw yeze yemetawt;
  so the Applied form this.....
  endeeee
  second apply alew papi;
  abo 3 4te apply abelugn
  ke script atuta eshi;
  gebi temari hono ke fresh eske exit exam wesaj yhen app endayameltwo
)
the fact that i care so much about this is valid because think about 1 Birr and Arada Beer;
I will recreate that impact with this very thought about video and script and story and personalities;
my goal is to make 10M Birr with the way 1 Birr did, we both ye lideta chulelewoch so why not
(
  yaw esun churche nw mimertelegn haha semteshal mommy
)
Also collab with Ale in the media side

(
  the amazing point i have understood today is that my market is so small and limited,
  and not infinity
)
(
  this 500 is to give all the time you have spent in Gebi worth it;
  you have learned all these years, make all that time worth it!
  this will carry you to the long future from grade 12 to job
    and even abroad studies
)
a message to the world, i climbed in the rooftop, metbes sesh and was reading to
  Psalms and listening to a Jazz Christian song, Jesus is a very personal God
  tekekel neberku? no but He is my God
    (my mother, my father, my bf, my wife, my first son; all have replacements except
    maybe my mother and father; maybe thats a reflection of how the Creator has no replacement.
    but God is the only God (in Orit the Dagim) and that shows how precious He is.)
    so mnm hatiyateh kesu mehret aybeltemena mnm ke amlakeh ke Geta ayarekeh
maybe this is a message to the world to call people into my clinic

-when apps that are veryyy big and started from a niche;
then forget their niche when they are big that is the opportunity to
take my niche because controlling a small market is enough for you eyu
-backgrounds blurred, faded or gradient of AAU in the onboarding!
its nice when you invite people into your life, the ones that have seen the resistance love it so much

-remember your good teachers; the ones that are passionate about their fields; be that

in designing an AI study app; i am stuck at a decision;
after quizzes students will be given an assessment on their weakness and strength based on the topics tested in the quiz; i am having troubles deciding:
1. how to display the strength and weaknesses and the report in general
2. if to store the assessment for future reference how would i list it, and how would things get handled when the students takes new quizzes
before giving recommendations you are free to ask me questions
 pleae be brief and with high word to value ratio in your responses
