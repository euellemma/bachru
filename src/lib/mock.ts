import logicOutline from "../../modules/freshman/logic/outline.json";
import courses from "../../modules/courses.json";
import type { MatricExam, ExitExam } from "src/types";

export const outline = logicOutline;
export const mockCourses = courses;

export const mockMatricExams = [
  {
    examId: "natural-science-2016",
    examTitle: "2016 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2016"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 40,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
    ],
  },
  {
    examId: "natural-science-2015",
    examTitle: "2015 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2015"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 38,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 34,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 33,
        totalMarks: 100,
      },
    ],
  },
  {
    examId: "natural-science-2014",
    examTitle: "2014 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2014"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 37,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 32,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 34,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 32,
        totalMarks: 100,
      },
    ],
  },
  {
    examId: "natural-science-2013",
    examTitle: "2013 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2013"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 32,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
    ],
  },
  {
    examId: "natural-science-2012",
    examTitle: "2012 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2012"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 33,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
    ],
  },
];

export const mockExitExams = [
  {
    examId: "cs-exit-2016",
    examTitle: "2016 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2016"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 100,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 15,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 20,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 15,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 15,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 12,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 13,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2015",
    examTitle: "2015 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2015"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 100,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 14,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 18,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 16,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 14,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 13,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 15,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2014",
    examTitle: "2014 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2014"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 95,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 13,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 17,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 14,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 13,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 14,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 14,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2013",
    examTitle: "2013 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2013"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 90,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 12,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 16,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 15,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 12,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 13,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 12,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2012",
    examTitle: "2012 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2012"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 85,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 12,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 15,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 13,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 12,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 12,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 11,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2011",
    examTitle: "2011 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2011"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 80,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 10,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 14,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 12,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 12,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 11,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 11,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2010",
    examTitle: "2010 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2010"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 75,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 10,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 13,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 11,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 11,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 10,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 10,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
];

export const fieldToTitle = {
  cs: "Computer Science",
  math: "Mathematics",
  eng: "Engineering",
  phy: "Physics",
  chem: "Chemistry",
  bio: "Biology",
  med: "Medicine",
  agri: "Agriculture",
  econ: "Economics",
  bus: "Business",
  hist: "History",
  socsci: "Social Sciences",
  lit: "Literature",
  hum: "Humanities",
  soc: "Sociology",
  art: "Art",
  music: "Music",
  law: "Law",
  gov: "Government",
  poli: "Political Science",
  envsci: "Environmental Science",
  mkt: "Marketing",
  health: "Health",
  design: "Design",
  film: "Film",
  perfart: "Performing Arts",
  writing: "Writing",
  fin: "Finance",
};

export const mockMatricExam: MatricExam = {
  examId: "natural-science-2023",
  examTitle: "2023 Natural Science Stream",
  tags: ["High School", "Natural Science", "Exit Exam", "2023"],

  examType: "matric",
  stream: "natural",
  subjects: [
    {
      subjectId: "math",
      subjectTitle: "Mathematics",
      duration: 180,
      totalQuestions: 40,
      totalMarks: 100,
      chapters: [
        {
          chapterId: "math-g9-01",
          chapterTitle: "Functions and Relations",
          description:
            "Introduction to functions, domain, range, and different types of relations",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-02",
          chapterTitle: "Linear Equations and Inequalities",
          description: "Solving systems of linear equations and inequalities",
          questionCount: 6,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-03",
          chapterTitle: "Polynomials",
          description:
            "Operations with polynomials, factoring, and polynomial equations",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-04",
          chapterTitle: "Quadratic Equations",
          description:
            "Solving and analyzing quadratic equations and functions",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-05",
          chapterTitle: "Coordinate Geometry",
          description:
            "Points, lines, and basic geometric concepts on coordinate plane",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-06",
          chapterTitle: "Euclidean Geometry",
          description: "Angles, triangles, circles, and geometric proofs",
          questionCount: 3,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g11-01",
          chapterTitle: "Trigonometry",
          description: "Trigonometric functions, identities, and equations",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-02",
          chapterTitle: "Calculus",
          description: "Limits, derivatives, and basic integration",
          questionCount: 6,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-03",
          chapterTitle: "Probability and Statistics",
          description:
            "Basic probability, statistical measures, and distributions",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-04",
          chapterTitle: "Vectors and 3D Geometry",
          description: "Vector operations and three-dimensional geometry",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-05",
          chapterTitle: "Complex Numbers",
          description: "Operations with complex numbers and applications",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-06",
          chapterTitle: "Matrices and Determinants",
          description:
            "Matrix operations, determinants, and linear transformations",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
      ],
    },
    {
      subjectId: "phy",
      subjectTitle: "Physics",
      duration: 180,
      totalQuestions: 35,
      totalMarks: 100,
      chapters: [
        {
          chapterId: "phy-g9-01",
          chapterTitle: "Mechanics",
          description: "Newton's laws, kinematics, and dynamics",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-02",
          chapterTitle: "Work, Energy, and Power",
          description:
            "Conservation of energy, work principles, and power calculations",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-03",
          chapterTitle: "Heat and Thermodynamics",
          description:
            "Temperature, heat transfer, and thermal properties of matter",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-04",
          chapterTitle: "Waves",
          description: "Wave properties, sound waves, and wave phenomena",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-05",
          chapterTitle: "Light and Optics",
          description: "Reflection, refraction, and optical instruments",
          questionCount: 3,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-06",
          chapterTitle: "Electricity",
          description:
            "Static electricity, electric fields, and basic circuits",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g11-01",
          chapterTitle: "Electromagnetism",
          description:
            "Magnetic fields, electromagnetic induction, and applications",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-02",
          chapterTitle: "Quantum Physics",
          description:
            "Photoelectric effect, atomic models, and quantum principles",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-03",
          chapterTitle: "Nuclear Physics",
          description: "Radioactivity, nuclear reactions, and applications",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-04",
          chapterTitle: "Fluid Mechanics",
          description: "Pressure, buoyancy, and fluid dynamics",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-05",
          chapterTitle: "Modern Physics",
          description:
            "Special relativity and introduction to particle physics",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-06",
          chapterTitle: "Solid State Physics",
          description:
            "Crystal structures, semiconductor physics, and applications",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
      ],
    },
    {
      subjectId: "chem",
      subjectTitle: "Chemistry",
      duration: 180,
      totalQuestions: 35,
      totalMarks: 100,
      chapters: [
        {
          chapterId: "chem-g9-01",
          chapterTitle: "Atomic Structure",
          description:
            "Atomic models, electron configuration, and periodic table",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-02",
          chapterTitle: "Chemical Bonding",
          description:
            "Ionic, covalent, and metallic bonds, molecular geometry",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-03",
          chapterTitle: "Stoichiometry",
          description:
            "Balanced equations, mole concept, and chemical calculations",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-04",
          chapterTitle: "States of Matter",
          description: "Properties of gases, liquids, and solids",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-05",
          chapterTitle: "Solutions",
          description: "Concentration, solubility, and colligative properties",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-06",
          chapterTitle: "Acids and Bases",
          description: "Properties, theories, pH, and neutralization reactions",
          questionCount: 3,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g11-01",
          chapterTitle: "Chemical Kinetics",
          description:
            "Reaction rates, factors affecting rates, and mechanisms",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-02",
          chapterTitle: "Chemical Equilibrium",
          description:
            "Equilibrium constants, Le Chatelier's principle, and applications",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-03",
          chapterTitle: "Thermochemistry",
          description: "Heat of reactions, enthalpy, entropy, and free energy",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-04",
          chapterTitle: "Electrochemistry",
          description:
            "Redox reactions, electrochemical cells, and electrolysis",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-05",
          chapterTitle: "Organic Chemistry",
          description: "Hydrocarbons, functional groups, and organic reactions",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-06",
          chapterTitle: "Analytical Chemistry",
          description: "Qualitative and quantitative analysis methods",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
      ],
    },
    {
      subjectId: "bio",
      subjectTitle: "Biology",
      duration: 180,
      totalQuestions: 35,
      totalMarks: 100,
      chapters: [
        {
          chapterId: "bio-g9-01",
          chapterTitle: "Cell Biology",
          description: "Cell structure, function, and cellular processes",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-02",
          chapterTitle: "Biochemistry",
          description: "Biomolecules, enzymes, and metabolic pathways",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-03",
          chapterTitle: "Plant Biology",
          description: "Plant structure, physiology, and reproduction",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-04",
          chapterTitle: "Human Anatomy and Physiology I",
          description: "Digestive, respiratory, and circulatory systems",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-05",
          chapterTitle: "Ecology",
          description:
            "Ecosystems, populations, and environmental interactions",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-06",
          chapterTitle: "Microbiology",
          description: "Bacteria, viruses, and microorganisms",
          questionCount: 3,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g11-01",
          chapterTitle: "Genetics",
          description:
            "Mendelian genetics, inheritance patterns, and genetic disorders",
          questionCount: 6,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-02",
          chapterTitle: "Molecular Biology",
          description:
            "DNA structure, replication, transcription, and translation",
          questionCount: 6,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-03",
          chapterTitle: "Evolution",
          description: "Natural selection, speciation, and evolutionary theory",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-04",
          chapterTitle: "Human Anatomy and Physiology II",
          description: "Nervous, endocrine, and reproductive systems",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-05",
          chapterTitle: "Immunology",
          description: "Immune response, disorders, and applications",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-06",
          chapterTitle: "Biotechnology",
          description: "Genetic engineering, cloning, and bioethics",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
      ],
    },
  ],
};

export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};

export const mockQuizQuestions = [
  {
    metadata: {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      topic: { title: "Algorithm Analysis", filename: "algorithm-analysis" },
      chapterTitle: "Algorithm Intro",
      chapterFilename: "algorithm-analysis-chapter",
      difficulty: 4,
      questionType: "workout",
      subType: "mathematical",
      src: "gen",
      confidence: 0.85,
      confidenceRemark: "Generated from textbook content",
      correctAnswer: null,
    },
    hint: `<div class="hint">Use the master theorem for recurrence relations, and identify the appropriate case.</div>`,
    solution: `<div class="solution">
      <h3>Solution Approach</h3>
      <ol>
        <li>We have the recurrence relation T(n) = 3T(n/2) + n²</li>
        <li>Comparing with the master theorem format T(n) = aT(n/b) + f(n), we have:
          <ul>
            <li>a = 3 (number of subproblems)</li>
            <li>b = 2 (factor by which input size is reduced)</li>
            <li>f(n) = n² (cost of dividing and combining)</li>
          </ul>
        </li>
        <li>Calculate n^(log_b a) = n^(log_2 3) ≈ n^1.585</li>
        <li>Since f(n) = n² and n² grows faster than n^1.585, we're in Case 3 of the master theorem</li>
        <li>For Case 3, if f(n) = Ω(n^(log_b a + ε)) for some ε > 0, and if af(n/b) ≤ kf(n) for some k < 1 and all sufficiently large n, then T(n) = Θ(f(n))</li>
        <li>Checking the regularity condition: 3(n/2)² = 3n²/4 < n² for large n, so the condition is satisfied</li>
        <li>Therefore, T(n) = Θ(n²)</li>
      </ol>
       <div class="note">This problem illustrates how to analyze the time complexity of divide-and-conquer algorithms using the master theorem.</div>
     </div>`,
    question: `<div class="question">
      <div class="question-text">
        <p>Solve the following recurrence relation and give the asymptotic time complexity:</p>
        <div class="math-display">T(n) = 3T(n/2) + n²</div>
        <p>Show all steps using the master theorem, and explain which case applies and why.</p>
      </div>
    </div>`,
  },
  {
    metadata: {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      topic: {
        title: "Epistemology and Meta-Epistemology",
        filename: "meta-epistemo",
      },
      chapterTitle: "Theoretical Foundations",
      chapterFilename: "theoretical-foundations",
      difficulty: 3,
      questionType: "multiple-choice",
      src: "gen",
      confidence: 0.9,
      confidenceRemark: "Generated from textbook content",
      correctAnswer: 0,
    },
    hint: `<div class="hint">Think about the time complexity of common sorting algorithms.</div>`,
    solution: `<div class="solution">
      <p>The correct answer is Quick Sort. While Quick Sort has a worst-case time complexity of O(n²), its average-case time complexity is O(n log n), making it faster than Bubble Sort and Selection Sort in practice for most datasets.</p>
      <ul>
        <li>Quick Sort: Average O(n log n), Worst O(n²)</li>
        <li>Merge Sort: Average and Worst O(n log n) but requires extra space</li>
        <li>Bubble Sort: Average and Worst O(n²)</li>
        <li>Selection Sort: Average and Worst O(n²)</li>
      </ul>
    </div>`,
    question: `<div class="question-text">Which sorting algorithm generally performs best for large datasets in practice?</div>`,
    options: [
      `<div class="option-content">Quick Sort</div>`,
      `<div class="option-content">Bubble Sort</div>`,
      `<div class="option-content">Selection Sort</div>`,
      `<div class="option-content">Linear Search</div>`,
    ],
  },
  {
    metadata: {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      topic: {
        title: "Deductive and Inductive Reasoning",
        filename: "deduc-induc",
      },
      chapterTitle: "Logical Reasoning",
      chapterFilename: "logical-reasoning",
      difficulty: 5,
      questionType: "multiple-choice",
      src: "gen",
      confidence: 0.85,
      confidenceRemark: "Generated from textbook content",
      correctAnswer: 3,
    },
    hint: `<div class="hint">Think about tree traversal methods and their ordering.</div>`,
    solution: `<div class="solution">
      <p>The correct answer is All of the above. For the given binary search tree, the traversal orders would be:</p>
      <ul>
        <li>In-order: 1, 3, 5, 7, 9, 11</li>
        <li>Pre-order: 7, 3, 1, 5, 9, 11</li>
        <li>Post-order: 1, 5, 3, 11, 9, 7</li>
      </ul>
      <p>For a binary search tree, an in-order traversal will always visit nodes in sorted order.</p>
    </div>`,
    question: `<div class="question-text">For a binary search tree with root 7, left subtree 3 (with children 1 and 5), and right subtree 9 (with right child 11), which traversal method(s) will visit the nodes in some specific order?</div>`,
    options: [
      `<div class="option-content">In-order traversal only</div>`,
      `<div class="option-content">Pre-order traversal only</div>`,
      `<div class="option-content">Post-order traversal only</div>`,
      `<div class="option-content">All of the above</div>`,
    ],
  },
  {
    metadata: {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      topic: { title: "Importance of Learning", filename: "importance-learn" },
      chapterTitle: "Learning Fundamentals",
      chapterFilename: "learning-fund",
      difficulty: 4,
      questionType: "multiple-choice",
      src: "gen",
      confidence: 0.9,
      confidenceRemark: "Generated from textbook content",
      correctAnswer: 2,
    },
    hint: `<div class="hint">Consider the properties of different data structures for rapid insertion and removal.</div>`,
    solution: `<div class="solution">
      <p>The correct answer is Linked List. Linked lists allow for O(1) insertion and deletion at any position when you have a pointer to the node, which makes them ideal for frequent insertions and deletions. Arrays require shifting elements, hash tables can have collisions, and binary trees require rebalancing.</p>
    </div>`,
    question: `<div class="question-text">Which data structure is most efficient for frequent insertions and deletions in the middle of the collection?</div>`,
    options: [
      `<div class="option-content">Array</div>`,
      `<div class="option-content">Hash Table</div>`,
      `<div class="option-content">Linked List</div>`,
      `<div class="option-content">Binary Search Tree</div>`,
    ],
  },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 3,
  //     questionType: "multiple-choice",
  //     src: "gen",
  //     confidence: 0.9,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: 1,
  //   },
  //   hint: `<div class="hint">Consider what happens when a hash collision occurs.</div>`,
  //   solution: `<div class="solution">
  //     <p>The correct answer is Chaining. In chaining, each bucket contains a linked list of all key-value pairs that hash to the same bucket. When a collision occurs, the new item is simply added to the list. Open addressing, on the other hand, places the colliding item in a different bucket according to a probing sequence.</p>
  //   </div>`,
  //   question: `<div class="question-text">Which collision resolution technique in hash tables stores multiple key-value pairs that hash to the same bucket in a linked list?</div>`,
  //   options: [
  //     `<div class="option-content">Linear Probing</div>`,
  //     `<div class="option-content">Chaining</div>`,
  //     `<div class="option-content">Quadratic Probing</div>`,
  //     `<div class="option-content">Double Hashing</div>`,
  //   ],
  // },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 3,
  //     questionType: "true-false",
  //     src: "gen",
  //     confidence: 0.9,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: "true",
  //   },
  //   hint: `<div class="hint">Consider the time complexity of heap operations.</div>`,
  //   solution: `<div class="solution">
  //     <p>This statement is true. A binary heap supports insertion and extraction of the minimum/maximum element in O(log n) time, where n is the number of elements in the heap. This makes it an efficient implementation for priority queues where quick access to the highest-priority element is required.</p>
  //     <ul>
  //       <li>Insertion: O(log n)</li>
  //       <li>Extract-min/max: O(log n)</li>
  //       <li>Peek at min/max: O(1)</li>
  //     </ul>
  //   </div>`,
  //   question: `<div class="question"> <div class="question-text">A binary heap is an efficient data structure for implementing priority queues because it allows insertion and extraction of the highest-priority element in logarithmic time.</div> </div>`,
  // },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 4,
  //     questionType: "true-false",
  //     src: "gen",
  //     confidence: 0.85,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: "false",
  //   },
  //   hint: `<div class="hint">Think about the relationship between time complexity and space requirements.</div>`,
  //   solution: `<div class="solution">
  //     <p>This statement is false. There is no direct correlation between an algorithm's time complexity and its space complexity. An algorithm can have excellent time complexity (e.g., O(n log n)) but poor space complexity (e.g., O(n²)), or vice versa. For example, merge sort has O(n log n) time complexity but requires O(n) additional space, while heapsort also has O(n log n) time complexity but requires only O(1) additional space.</p>
  //   </div>`,
  //   question: `<div class="question"> <div class="question-text">An algorithm with better time complexity will always have better space complexity compared to algorithms with worse time complexity.</div> </div>`,
  // },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 3,
  //     questionType: "true-false",
  //     src: "gen",
  //     confidence: 0.9,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: "false",
  //   },
  //   hint: `<div class="hint">Consider the properties of different graph representations.</div>`,
  //   solution: `<div class="solution">
  //     <p>This statement is false. An adjacency matrix requires O(V²) space regardless of how many edges are in the graph, where V is the number of vertices. An adjacency list, on the other hand, requires O(V + E) space, where E is the number of edges. For sparse graphs (where E is much less than V²), adjacency lists are more space-efficient. Only for very dense graphs (where E approaches V²) would an adjacency matrix be comparable or better in terms of space efficiency.</p>
  //   </div>`,
  //   question: `<div class="question"> <div class="question-text">An adjacency matrix is always more space-efficient than an adjacency list for representing graphs.</div> </div>`,
  // },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 4,
  //     questionType: "workout",
  //     subType: "mathematical",
  //     src: "gen",
  //     confidence: 0.85,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: null,
  //   },
  //   hint: `<div class="hint">Use the master theorem for recurrence relations, and identify the appropriate case.</div>`,
  //   solution: `<div class="solution">
  //     <h3>Solution Approach</h3>
  //     <ol>
  //       <li>We'll trace through the quick sort algorithm using the last element as pivot for each partition.</li>
  //       <li>Original array: [8, 3, 1, 7, 5, 2, 6, 4]</li>
  //       <li>First partition:
  //         <ul>
  //           <li>Pivot: 4</li>
  //           <li>After partitioning: [3, 1, 2, 4, 5, 7, 6, 8]</li>
  //           <li>Elements less than pivot: [3, 1, 2]</li>
  //           <li>Elements greater than pivot: [5, 7, 6, 8]</li>
  //         </ul>
  //       </li>
  //       <li>Recursively sort left partition [3, 1, 2]:
  //         <ul>
  //           <li>Pivot: 2</li>
  //           <li>After partitioning: [1, 2, 3]</li>
  //           <li>Left side: [1] (sorted)</li>
  //           <li>Right side: [3] (sorted)</li>
  //         </ul>
  //       </li>
  //       <li>Recursively sort right partition [5, 7, 6, 8]:
  //         <ul>
  //           <li>Pivot: 8</li>
  //           <li>After partitioning: [5, 7, 6, 8]</li>
  //           <li>Left side: [5, 7, 6]</li>
  //           <li>Right side: [] (sorted)</li>
  //         </ul>
  //       </li>
  //       <li>Recursively sort [5, 7, 6]:
  //         <ul>
  //           <li>Pivot: 6</li>
  //           <li>After partitioning: [5, 6, 7]</li>
  //           <li>Left side: [5] (sorted)</li>
  //           <li>Right side: [7] (sorted)</li>
  //         </ul>
  //       </li>
  //       <li>Final sorted array: [1, 2, 3, 4, 5, 6, 7, 8]</li>
  //     </ol>

  //     <p>Key observations:</p>
  //     <ul>
  //       <li>Number of comparisons: 4 + 2 + 3 + 2 = 11 comparisons</li>
  //       <li>Number of swaps: 5 swaps</li>
  //       <li>Number of recursive calls: 5 calls</li>
  //       <li>Partition quality: Reasonably balanced, pivot choices led to good partitioning</li>
  //     </ul>

  //     <div class="note">This trace demonstrates how the quick sort algorithm works by repeatedly partitioning the array around a pivot element. The efficiency depends on how well the pivots divide the array, with the ideal case being equal partitions at each step.</div>
  //   </div>`,
  //   question: `<div class="question">
  //     <div class="question-text">
  //       <p>Trace through the execution of the quick sort algorithm on the following array:</p>
  //       <div class="example">[8, 3, 1, 7, 5, 2, 6, 4]</div>
  //       <p>Use the last element of each partition as the pivot. Show each step of the algorithm, including all partitioning steps and recursive calls. In your answer, include:</p>
  //       <ul>
  //         <li>The state of the array after each partitioning step</li>
  //         <li>The pivot element for each partition</li>
  //         <li>The total number of comparisons performed</li>
  //         <li>The total number of swaps performed</li>
  //       </ul>
  //     </div>
  //   </div>`,
  // },
];
