import type { QuestionType, QuestionPayload, ScoringMode } from "@/lib/types";

export type SeedQuestion = {
  id: string;
  type: QuestionType;
  stem: string;
  instruction: string;
  explanation: string;
  points: number;
  requiredAnswers: number | null;
  scoringMode: ScoringMode;
  sourceId: string | null;
  needsReview: boolean;
  reviewNote: string | null;
  payload: QuestionPayload;
};

export const DEMO_QUESTIONS: SeedQuestion[] = [
  {
    id: "demo-q1",
    type: "SINGLE_CHOICE",
    stem: "Which visual presentation option is best for showing proportions in data?",
    instruction: "Choose one.",
    explanation:
      "A pie chart is best to show proportions of a whole. Use it when the total of your numbers is 100%.",
    points: 1,
    requiredAnswers: 1,
    scoringMode: "all_or_nothing",
    sourceId: "demo-single",
    needsReview: false,
    reviewNote: null,
    payload: {
      options: [
        { id: "a", text: "Table" },
        { id: "b", text: "Bar Chart" },
        { id: "c", text: "Line Chart" },
        { id: "d", text: "Pie Chart" },
      ],
      correctOptionIds: ["d"],
    },
  },
  {
    id: "demo-q2",
    type: "MULTIPLE_CHOICE",
    stem: "Which two of the following items form your online identity?",
    instruction: "Choose two.",
    explanation:
      "Your online identity is how people perceive you. The two items that contribute most are social media profiles and posts you make to blogs and social media sites.",
    points: 1,
    requiredAnswers: 2,
    scoringMode: "all_or_nothing",
    sourceId: "demo-multi",
    needsReview: false,
    reviewNote: null,
    payload: {
      options: [
        { id: "a", text: "Frequency of text messaging" },
        { id: "b", text: "Email activity" },
        { id: "c", text: "User login name" },
        { id: "d", text: "Password" },
        { id: "e", text: "Posts made to blogs and social media sites" },
        { id: "f", text: "Social media profiles" },
      ],
      correctOptionIds: ["e", "f"],
    },
  },
  {
    id: "demo-q3",
    type: "TRUE_FALSE",
    stem: "Company-based emails imply affiliation with the company and are not appropriate for personal correspondence.",
    instruction: "Select True or False.",
    explanation:
      "Company-based emails imply affiliation with the company and are not appropriate for personal correspondence.",
    points: 1,
    requiredAnswers: 1,
    scoringMode: "all_or_nothing",
    sourceId: "demo-tf",
    needsReview: false,
    reviewNote: null,
    payload: {
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctOptionIds: ["true"],
    },
  },
  {
    id: "demo-q4",
    type: "YES_NO",
    stem: "Is “Enunciate important facts” an example of an effective verbal skill?",
    instruction: "Select Yes or No.",
    explanation:
      "Effective verbal skills include moderating intonation, rate, tone, volume, and enunciation.",
    points: 1,
    requiredAnswers: 1,
    scoringMode: "all_or_nothing",
    sourceId: "demo-yn",
    needsReview: false,
    reviewNote: null,
    payload: {
      options: [
        { id: "yes", text: "Yes" },
        { id: "no", text: "No" },
      ],
      correctOptionIds: ["yes"],
    },
  },
  {
    id: "demo-q5",
    type: "MATCHING",
    stem: "Match each communication technology to the most appropriate situation.",
    instruction:
      "Each communication technology may be used once. Match every situation.",
    explanation:
      "Conference call = Team meeting with members in different cities. Chat = Contacting online support. Voicemail = Leaving a message for a business associate. Text message = Sending a note to a coworker to ask what she wants for lunch.",
    points: 1,
    requiredAnswers: 4,
    scoringMode: "all_or_nothing",
    sourceId: "demo-match",
    needsReview: false,
    reviewNote: null,
    payload: {
      sources: [
        { id: "s1", text: "Text message" },
        { id: "s2", text: "Chat" },
        { id: "s3", text: "Conference call" },
        { id: "s4", text: "Voicemail" },
      ],
      targets: [
        { id: "t1", text: "Sending a note to a coworker to ask what she wants for lunch." },
        { id: "t2", text: "Contacting online support for assistance." },
        { id: "t3", text: "Team meeting with members in different cities." },
        { id: "t4", text: "Leaving a message for a business associate." },
      ],
      pairs: [
        { sourceId: "s1", targetId: "t1" },
        { sourceId: "s2", targetId: "t2" },
        { sourceId: "s3", targetId: "t3" },
        { sourceId: "s4", targetId: "t4" },
      ],
    },
  },
  {
    id: "demo-q6",
    type: "ORDERING",
    stem: "In which order should you organize the components of meeting minutes?",
    instruction: "Arrange the items in the correct sequence.",
    explanation:
      "Minutes should include: 1. Date and time the meeting started. 2. An outline of all topics discussed in the order discussed. 3. Names of individuals who proposed topics, or strongly supported or opposed topics. 4. Time the meeting adjourned. 5. Date, time and location of the next meeting.",
    points: 1,
    requiredAnswers: 5,
    scoringMode: "all_or_nothing",
    sourceId: "demo-order",
    needsReview: false,
    reviewNote: null,
    payload: {
      orderItems: [
        { id: "o1", text: "Date and time the meeting started.", correctPosition: 1 },
        { id: "o2", text: "An outline of all topics discussed in the order discussed.", correctPosition: 2 },
        {
          id: "o3",
          text: "Names of individuals who proposed topics, or strongly supported or opposed topics.",
          correctPosition: 3,
        },
        { id: "o4", text: "Time the meeting adjourned.", correctPosition: 4 },
        { id: "o5", text: "Date, time and location of the next meeting.", correctPosition: 5 },
      ],
    },
  },
  {
    id: "demo-q7",
    type: "DROPDOWN",
    stem: "A speaker opens with protest footage and tearful interviews, then outlines how countries address climate change.",
    instruction: "Complete each statement.",
    explanation:
      "The message type is persuasive because the content is designed to recruit the listener to the speaker's perspective. The message uses emotions to influence the listener with video clips intended to evoke fear and compassion.",
    points: 1,
    requiredAnswers: 2,
    scoringMode: "per_blank",
    sourceId: "demo-drop",
    needsReview: false,
    reviewNote: null,
    payload: {
      blanks: [
        {
          id: "b1",
          prompt: "The message type in this scenario is",
          choices: ["informative", "persuasive", "motivational", "correctional"],
          correct: "persuasive",
        },
        {
          id: "b2",
          prompt: "The message uses",
          choices: ["ethics", "emotions", "logic", "culture"],
          correct: "emotions",
        },
      ],
    },
  },
  {
    id: "demo-q8",
    type: "IMAGE_CHOICE",
    stem: "Select the image that is the best example of the design principle known as Contrast.",
    instruction: "Choose one image.",
    explanation:
      "The design principle of Contrast communicates focus by making one element stand out. The correct image shows one element as yellow while the others are gray, communicating that the one is different or unique.",
    points: 1,
    requiredAnswers: 1,
    scoringMode: "all_or_nothing",
    sourceId: "demo-image",
    needsReview: false,
    reviewNote: null,
    payload: {
      options: [
        {
          id: "i1",
          text: "Multicolored thought bubbles hovering over people",
          imageUrl: "/quiz-media/contrast-bubbles-people.jpeg",
          alt: "People with colorful thought bubbles",
        },
        {
          id: "i2",
          text: "Eight grey people. One yellow person.",
          imageUrl: "/quiz-media/contrast-yellow-person.jpeg",
          alt: "A row of gray figures with one yellow figure",
        },
        {
          id: "i3",
          text: "Multicolored tulips",
          imageUrl: "/quiz-media/contrast-tulips.jpeg",
          alt: "A field of colorful tulips",
        },
        {
          id: "i4",
          text: "Thought bubbles hovering over chairs",
          imageUrl: "/quiz-media/contrast-bubbles-chairs.jpeg",
          alt: "Empty chairs with thought bubbles",
        },
      ],
      correctOptionIds: ["i2"],
    },
  },
];
