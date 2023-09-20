import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

const QUESTIONS_EN = [
  {
    id: 1,
    data: {
      themes_subject: "Influencer/Impact",
      talent: "initiator",
      text: `"Don't stop me now!" Do you find yourself often in a situation where you just need to take action?`,
      ts_key: "dict.questions.initiator_01",
      img: { src: "/Initiator_01.svg" },
    },
  },
  {
    id: 2,
    data: {
      themes_subject: "Influencer/Impact",
      talent: "initiator",
      text: `"Hey everyone, let's start!" Does it sound like you?`,
      ts_key: "dict.questions.initiator_02",
      img: { src: "/Initiator_02.svg" },
    },
  },
  {
    id: 3,
    data: {
      themes_subject: "Influencer/Impact",
      talent: "initiator",
      text: `"I can't stand it when there's no action! I hate wasting time." Is that you?`,
      ts_key: "dict.questions.initiator_03",
      img: { src: "/Initiator_03.svg" },
    },
  },
  {
    id: 4,
    data: {
      themes_subject: "Relationship/Emotion",
      talent: "flexible",
      text: `"I can adapt easily to different changes." Is that you?`,
      ts_key: "dict.questions.flexible_01",
      img: { src: "/Flexible_01.svg" },
    },
  },
  {
    id: 5,
    data: {
      themes_subject: "Relationship/Emotion",
      talent: "flexible",
      text: `"No matter what the situation is, I just fit in and adapt."`,
      ts_key: "dict.questions.flexible_02",
      img: { src: "/Flexible_02.svg" },
    },
  },
  {
    id: 6,
    data: {
      themes_subject: "Relationship/Emotion",
      talent: "flexible",
      text: `"No big deal. Frequent changes are not a problem for me." Do you agree?`,
      ts_key: "dict.questions.flexible_03",
      img: { src: "/Flexible_03.svg" },
    },
  },
  {
    id: 7,
    data: {
      themes_subject: "Thinker/Mind",
      talent: "analyser",
      text: `"I love it when I can back things up with facts and logical thinking."`,
      ts_key: "dict.questions.analyser_01",
      img: { src: "/Analyser_01.svg" },
    },
  },
  {
    id: 8,
    data: {
      themes_subject: "Thinker/Mind",
      talent: "analyser",
      text: `"Analyzing things comes easily to me."`,
      ts_key: "dict.questions.analyser_02",
      img: { src: "/Analyser_02.svg" },
    },
  },
  {
    id: 9,
    data: {
      themes_subject: "Thinker/Mind",
      talent: "analyser",
      text: `"I prefer facts rather than intuition."`,
      ts_key: "dict.questions.analyser_03",
      img: { src: "/Analyser_03.svg" },
    },
  },
  {
    id: 10,
    data: {
      themes_subject: "Execution",
      talent: "believer",
      text: `"Don't question my values! I don't compromise important things in my life."`,
      ts_key: "dict.questions.believer_01",
      img: { src: "/Believer_01.svg" },
    },
  },
  {
    id: 11,
    data: {
      themes_subject: "Execution",
      talent: "believer",
      text: `"I believe in my values. They are a central part of who I am."`,
      ts_key: "dict.questions.believer_02",
      img: { src: "/Believer_02.svg" },
    },
  },
  {
    id: 12,
    data: {
      themes_subject: "Execution",
      talent: "believer",
      text: `"I got your point, but whatever you say will not change my mind about my beliefs."`,
      ts_key: "dict.questions.believer_03",
      img: { src: "/Believer_03.svg" },
    },
  },
  {
    id: 13,
    data: {
      themes_subject: "Thinker",
      talent: "ideamaker",
      text: `"Do I have new ideas?! Plenty and often!"`,
      ts_key: "dict.questions.ideamaker_01",
      img: { src: "/Ideamaker_01.svg" },
    },
  },
  {
    id: 14,
    data: {
      themes_subject: "Thinker",
      talent: "ideamaker",
      text: `"Let's sit down and think this all the way through. Let me share my ideas with you, guys." Is that you?`,
      ts_key: "dict.questions.ideamaker_02",
      img: { src: "/Ideamaker_02.svg" },
    },
  },
  {
    id: 15,
    data: {
      themes_subject: "Thinker",
      talent: "ideamaker",
      text: `"I love challanges where I can come up with new ideas!"`,
      ts_key: "dict.questions.ideamaker_03",
      img: { src: "/Ideamaker_03.svg" },
    },
  },
  {
    id: 16,
    data: {
      themes_subject: "Relationship",
      talent: "coach",
      text: `"Come on, you can do it!" Do you like to help others to succeed?`,
      ts_key: "dict.questions.coach_01",
      img: { src: "/Coach_01.svg" },
    },
  },
  {
    id: 17,
    data: {
      themes_subject: "Relationship",
      talent: "coach",
      text: `"Yes, I love to listen to people and give feedback." I am a born coach!`,
      ts_key: "dict.questions.coach_02",
      img: { src: "/Coach_02.svg" },
    },
  },
  {
    id: 18,
    data: {
      themes_subject: "Relationship",
      talent: "coach",
      text: `"Come on, there's huge potential in you." Do you like to develop other people?`,
      ts_key: "dict.questions.coach_03",
      img: { src: "/Coach_03.svg" },
    },
  },
  {
    id: 19,
    data: {
      themes_subject: "Influencer",
      talent: "leader",
      text: `"When I feel it's important, I am not afraid to take charge."`,
      ts_key: "dict.questions.leader_01",
      img: { src: "/Leader_01.svg" },
    },
  },
  {
    id: 20,
    data: {
      themes_subject: "Influencer",
      talent: "leader",
      text: `"I love to be in charge, and I have no problem speaking up!"`,
      ts_key: "dict.questions.leader_02",
      img: { src: "/Leader_02.svg" },
    },
  },
  {
    id: 21,
    data: {
      themes_subject: "Influencer",
      talent: "leader",
      text: `"Tell me your opinion. I hate beating around the bush!" Is that you?`,
      ts_key: "dict.questions.leader_03",
      img: { src: "/Leader_03.svg" },
    },
  },
  {
    id: 22,
    data: {
      themes_subject: "Influencer",
      talent: "communicator",
      text: `"You like to host, speak and be listened to. Is that your style?"`,
      ts_key: "dict.questions.communicator_01",
      img: { src: "/Communicator_01.svg" },
    },
  },
  {
    id: 23,
    data: {
      themes_subject: "Influencer",
      talent: "communicator",
      text: `"Storyteller is my middle name."`,
      ts_key: "dict.questions.communicator_02",
      img: { src: "/Communicator_02.svg" },
    },
  },
  {
    id: 24,
    data: {
      themes_subject: "Influencer",
      talent: "communicator",
      text: `"My audience loves me and I love my audience."`,
      ts_key: "dict.questions.communicator_03",
      img: { src: "/Communicator_03.svg" },
    },
  },
  {
    id: 25,
    data: {
      themes_subject: "Influencer",
      talent: "challenger",
      text: `"I'll win, I'll win. I was born to win!"`,
      ts_key: "dict.questions.challenger_01",
      img: { src: "/Challenger_01.svg" },
    },
  },
  {
    id: 26,
    data: {
      themes_subject: "Influencer",
      talent: "challenger",
      text: `"Where is the contest? I want to be there and win!"`,
      ts_key: "dict.questions.challenger_02",
      img: { src: "/Challenger_02.svg" },
    },
  },
  {
    id: 27,
    data: {
      themes_subject: "Influencer",
      talent: "challenger",
      text: `"I didn't come to just be here and watch, I came to win!"`,
      ts_key: "dict.questions.challenger_03",
      img: { src: "/Challenger_03.svg" },
    },
  },
  {
    id: 28,
    data: {
      themes_subject: "Relationship",
      talent: "connector",
      text: `"Come on guys, just agree on something!" I am the bridge builder.`,
      ts_key: "dict.questions.mediator_01",
      img: { src: "/Mediator_01.svg" },
    },
  },
  {
    id: 29,
    data: {
      themes_subject: "Relationship",
      talent: "connector",
      text: `"We must all take care of the unity of humankind. We are all connected." Do you feel the same?`,
      ts_key: "dict.questions.mediator_02",
      img: { src: "/Mediator_02.svg" },
    },
  },
  {
    id: 30,
    data: {
      themes_subject: "Relationship",
      talent: "connector",
      text: `"I just need to find alignment between everyone. I can keep the balance in the environment."`,
      ts_key: "dict.questions.mediator_03",
      img: { src: "/Mediator_03.svg" },
    },
  },
  {
    id: 31,
    data: {
      themes_subject: "Relationship",
      talent: "empathizer",
      text: `"I know how you feel. I share your perspective." Does that sound like you?`,
      ts_key: "dict.questions.empathizer_01",
      img: { src: "/Empathizer_01.svg" },
    },
  },
  {
    id: 32,
    data: {
      themes_subject: "Relationship",
      talent: "empathizer",
      text: `"I easily help others to find the right words to express their feelings."`,
      ts_key: "dict.questions.empathizer_02",
      img: { src: "/Empathizer_02.svg" },
    },
  },
  {
    id: 33,
    data: {
      themes_subject: "Relationship",
      talent: "empathizer",
      text: `"I have my feelings and emotions." Do you feel it too?`,
      ts_key: "dict.questions.empathizer_03",
      img: { src: "/Empathizer_03.svg" },
    },
  },
  {
    id: 34,
    data: {
      themes_subject: "Execution",
      talent: "concentrated",
      text: `"First I need to finish one thing, then I can move on to another."`,
      ts_key: "dict.questions.concentrated_01",
      img: { src: "/Concentrated_01.svg" },
    },
  },
  {
    id: 35,
    data: {
      themes_subject: "Execution",
      talent: "concentrated",
      text: `"I am obsessed with goals. If I don't set them, I am lost."`,
      ts_key: "dict.questions.concentrated_02",
      img: { src: "/Concentrated_02.svg" },
    },
  },
  {
    id: 36,
    data: {
      themes_subject: "Execution",
      talent: "concentrated",
      text: `"Come on, just stay focused!" Is it you who often needs to keep everyone on point?`,
      ts_key: "dict.questions.concentrated_03",
      img: { src: "/Concentrated_03.svg" },
    },
  },
  {
    id: 37,
    data: {
      themes_subject: "Execution",
      talent: "loverOfOrder",
      text: `"If you need someone who sets up processes and deadlines, just give me a call."`,
      ts_key: "dict.questions.lover_of_order_01",
      img: { src: "/Lover_of_order_01.svg" },
    },
  },
  {
    id: 38,
    data: {
      themes_subject: "Execution",
      talent: "loverOfOrder",
      text: `"I need structure and don't like surprises." Is that you?`,
      ts_key: "dict.questions.lover_of_order_02",
      img: { src: "/Lover_of_order_02.svg" },
    },
  },
  {
    id: 39,
    data: {
      themes_subject: "Execution",
      talent: "loverOfOrder",
      text: `"If the world around me is predictable, then I feel safe that all is under control."`,
      ts_key: "dict.questions.lover_of_order_03",
      img: { src: "/Lover_of_order_03.svg" },
    },
  },
  {
    id: 40,
    data: {
      themes_subject: "Thinker",
      talent: "selfDeveloper",
      text: `"My life is all about learning new things." Is that you?`,
      ts_key: "dict.questions.self_developer_01",
      img: { src: "/Self-developer_01.svg" },
    },
  },
  {
    id: 41,
    data: {
      themes_subject: "Thinker",
      talent: "selfDeveloper",
      text: `"Teach me, teach me. I need to learn it all." Are you open to learn new things?`,
      ts_key: "dict.questions.self_developer_02",
      img: { src: "/Self-developer_02.svg" },
    },
  },
  {
    id: 42,
    data: {
      themes_subject: "Thinker",
      talent: "selfDeveloper",
      text: `"I am obsessed about exploring many interests and new paths." `,
      ts_key: "dict.questions.self_developer_03",
      img: { src: "/Self-developer_03.svg" },
    },
  },
  {
    id: 43,
    data: {
      themes_subject: "Relationship",
      talent: "positive",
      text: `"Stop moaning! Look how beautiful it is." Do you also seek positivity?`,
      ts_key: "dict.questions.positive_01",
      img: { src: "/Positive_01.svg" },
    },
  },
  {
    id: 44,
    data: {
      themes_subject: "Relationship",
      talent: "positive",
      text: `"Even if it's cloudy I feel like sun is shining everywhere." Are you a born optimist?`,
      ts_key: "dict.questions.positive_02",
      img: { src: "/Positive_02.svg" },
    },
  },
  {
    id: 45,
    data: {
      themes_subject: "Relationship",
      talent: "positive",
      text: `"I can sell enthusiasm. No cynic will drag me down."`,
      ts_key: "dict.questions.positive_03",
      img: { src: "/Positive_03.svg" },
    },
  },
  {
    id: 46,
    data: {
      themes_subject: "Execution",
      talent: "responsible",
      text: `"When I say I commit to it, I commit to it. You bet I'm responsible."`,
      ts_key: "dict.questions.responsible_01",
      img: { src: "/Responsible_01.svg" },
    },
  },
  {
    id: 47,
    data: {
      themes_subject: "Execution",
      talent: "responsible",
      text: `"I accept the consequences of my actions."`,
      ts_key: "dict.questions.responsible_02",
      img: { src: "/Responsible_02.svg" },
    },
  },
  {
    id: 48,
    data: {
      themes_subject: "Execution",
      talent: "responsible",
      text: `"I take my commitments seriously."`,
      ts_key: "dict.questions.responsible_03",
      img: { src: "/Responsible_03.svg" },
    },
  },
  {
    id: 49,
    data: {
      themes_subject: "Influencer",
      talent: "selfBeliever",
      text: `"I know I can do great things. I strongly believe in myself!"`,
      ts_key: "dict.questions.self_believer_01",
      img: { src: "/Self-believer_01.svg" },
    },
  },
  {
    id: 50,
    data: {
      themes_subject: "Influencer",
      talent: "selfBeliever",
      text: `"People might say different things at different times. Yet, I know what I'm capable of!" Is that you?`,
      ts_key: "dict.questions.self_believer_02",
      img: { src: "/Self-believer_02.svg" },
    },
  },
  {
    id: 51,
    data: {
      themes_subject: "Influencer",
      talent: "selfBeliever",
      text: `"You may disagree, but you won't break me!" Do you believe in yourself?`,
      ts_key: "dict.questions.self_believer_03",
      img: { src: "/Self-believer_03.svg" },
    },
  },
  {
    id: 52,
    data: {
      themes_subject: "Execution",
      talent: "solver",
      text: `"We simply need to solve this. No issue will be swept under the rug!"`,
      ts_key: "dict.questions.solver_01",
      img: { src: "/Solver_01.svg" },
    },
  },
  {
    id: 53,
    data: {
      themes_subject: "Execution",
      talent: "solver",
      text: `"I strongly believe I can solve it!" Is that your approach?`,
      ts_key: "dict.questions.solver_02",
      img: { src: "/Solver_02.svg" },
    },
  },
  {
    id: 54,
    data: {
      themes_subject: "Execution",
      talent: "solver",
      text: `"I am a born solver!"`,
      ts_key: "dict.questions.solver_03",
      img: { src: "/Solver_03.svg" },
    },
  },
  {
    id: 55,
    data: {
      themes_subject: "Thinker",
      talent: "strategist",
      text: `I often ask - "What if?" Do you naturally consider consequences and apply strategic thinking?`,
      ts_key: "dict.questions.strategist_01",
      img: { src: "/Strategist_01.svg" },
    },
  },
  {
    id: 56,
    data: {
      themes_subject: "Thinker",
      talent: "strategist",
      text: `"I check the patterns, see the issues and then take action. Yes, I'm a born Strategist!"`,
      ts_key: "dict.questions.strategist_02",
      img: { src: "/Strategist_02.svg" },
    },
  },
  {
    id: 57,
    data: {
      themes_subject: "Thinker",
      talent: "strategist",
      text: `"Let's think a few steps ahead. A good strategy is a must." Do you agree?`,
      ts_key: "dict.questions.strategist_03",
      img: { src: "/Strategist_03.svg" },
    },
  },
  {
    id: 58,
    data: {
      themes_subject: "Thinker",
      talent: "intellectual",
      text: `"No matter what it's about, I enjoy thinking about it." Does that sound like you?`,
      ts_key: "dict.questions.intellectual_01",
      img: { src: "/Intellectual_01.svg" },
    },
  },
  {
    id: 59,
    data: {
      themes_subject: "Thinker",
      talent: "intellectual",
      text: `"Thinking doesn't bother me. Actually it's something I love doing."`,
      ts_key: "dict.questions.intellectual_02",
      img: { src: "/Intellectual_02.svg" },
    },
  },
  {
    id: 60,
    data: {
      themes_subject: "Thinker",
      talent: "intellectual",
      text: `"Let me think... I spend a lot of time just thinking about things."`,
      ts_key: "dict.questions.intellectual_03",
      img: { src: "/Intellectual_03.svg" },
    },
  },
];

const messages = defineMessages({
  "dict.questions.initiator_01": {
    id: "dict.questions.initiator_01",
    defaultMessage: `"Don't stop me now!" Do you find yourself often in a situation where you just need to take action?`,
  },
  "dict.questions.initiator_02": {
    id: "dict.questions.initiator_02",
    defaultMessage: `"Hey everyone, let's start!" Does it sound like you?`,
  },
  "dict.questions.initiator_03": {
    id: "dict.questions.initiator_03",
    defaultMessage: `"I can't stand it when there's no action! I hate wasting time." Is that you?`,
  },
  "dict.questions.flexible_01": {
    id: "dict.questions.flexible_01",
    defaultMessage: `"I can adapt easily to different changes." Is that you?`,
  },
  "dict.questions.flexible_02": {
    id: "dict.questions.flexible_02",
    defaultMessage: `"No matter what the situation is, I just fit in and adapt."`,
  },
  "dict.questions.flexible_03": {
    id: "dict.questions.flexible_03",
    defaultMessage: `"No big deal. Frequent changes are not a problem for me." Do you agree?`,
  },
  "dict.questions.analyser_01": {
    id: "dict.questions.analyser_01",
    defaultMessage: `"I love it when I can back things up with facts and logical thinking."`,
  },
  "dict.questions.analyser_02": {
    id: "dict.questions.analyser_02",
    defaultMessage: `"Analyzing things comes easily to me."`,
  },
  "dict.questions.analyser_03": {
    id: "dict.questions.analyser_03",
    defaultMessage: `"I prefer facts rather than intuition."`,
  },
  "dict.questions.believer_01": {
    id: "dict.questions.believer_01",
    defaultMessage: `"Don't question my values! I don't compromise important things in my life."`,
  },
  "dict.questions.believer_02": {
    id: "dict.questions.believer_02",
    defaultMessage: `"I believe in my values. They are a central part of who I am."`,
  },
  "dict.questions.believer_03": {
    id: "dict.questions.believer_03",
    defaultMessage: `"I got your point, but whatever you say will not change my mind about my beliefs."`,
  },
  "dict.questions.ideamaker_01": {
    id: "dict.questions.ideamaker_01",
    defaultMessage: `"Do I have new ideas?! Plenty and often!"`,
  },
  "dict.questions.ideamaker_02": {
    id: "dict.questions.ideamaker_02",
    defaultMessage: `"Let's sit down and think this all the way through. Let me share my ideas with you, guys." Is that you?`,
  },
  "dict.questions.ideamaker_03": {
    id: "dict.questions.ideamaker_03",
    defaultMessage: `"I love challanges where I can come up with new ideas!"`,
  },
  "dict.questions.coach_01": {
    id: "dict.questions.coach_01",
    defaultMessage: `"Come on, you can do it!" Do you like to help others to succeed?`,
  },
  "dict.questions.coach_02": {
    id: "dict.questions.coach_02",
    defaultMessage: `"Yes, I love to listen to people and give feedback." I am a born coach!`,
  },
  "dict.questions.coach_03": {
    id: "dict.questions.coach_03",
    defaultMessage: `"Come on, there's huge potential in you." Do you like to develop other people?`,
  },
  "dict.questions.leader_01": {
    id: "dict.questions.leader_01",
    defaultMessage: `"When I feel it's important, I am not afraid to take charge."`,
  },
  "dict.questions.leader_02": {
    id: "dict.questions.leader_02",
    defaultMessage: `"I love to be in charge, and I have no problem speaking up!"`,
  },
  "dict.questions.leader_03": {
    id: "dict.questions.leader_03",
    defaultMessage: `"Tell me your opinion. I hate beating around the bush!" Is that you?`,
  },
  "dict.questions.communicator_01": {
    id: "dict.questions.communicator_01",
    defaultMessage: `"You like to host, speak and be listened to. Is that your style?"`,
  },
  "dict.questions.communicator_02": {
    id: "dict.questions.communicator_02",
    defaultMessage: `"Storyteller is my middle name."`,
  },
  "dict.questions.communicator_03": {
    id: "dict.questions.communicator_03",
    defaultMessage: `"My audience loves me and I love my audience."`,
  },
  "dict.questions.challenger_01": {
    id: "dict.questions.challenger_01",
    defaultMessage: `"I'll win, I'll win. I was born to win!"`,
  },
  "dict.questions.challenger_02": {
    id: "dict.questions.challenger_02",
    defaultMessage: `"Where is the contest? I want to be there and win!"`,
  },
  "dict.questions.challenger_03": {
    id: "dict.questions.challenger_03",
    defaultMessage: `"I didn't come to just be here and watch, I came to win!"`,
  },
  "dict.questions.mediator_01": {
    id: "dict.questions.mediator_01",
    defaultMessage: `"Come on guys, just agree on something!" I am the bridge builder.`,
  },
  "dict.questions.mediator_02": {
    id: "dict.questions.mediator_02",
    defaultMessage: `"We must all take care of the unity of humankind. We are all connected." Do you feel the same?`,
  },
  "dict.questions.mediator_03": {
    id: "dict.questions.mediator_03",
    defaultMessage: `"I just need to find alignment between everyone. I can keep the balance in the environment."`,
  },
  "dict.questions.empathizer_01": {
    id: "dict.questions.empathizer_01",
    defaultMessage: `"I know how you feel. I share your perspective." Does that sound like you?`,
  },
  "dict.questions.empathizer_02": {
    id: "dict.questions.empathizer_02",
    defaultMessage: `"I easily help others to find the right words to express their feelings."`,
  },
  "dict.questions.empathizer_03": {
    id: "dict.questions.empathizer_03",
    defaultMessage: `"I have my feelings and emotions." Do you feel it too?`,
  },
  "dict.questions.concentrated_01": {
    id: "dict.questions.concentrated_01",
    defaultMessage: `"First I need to finish one thing, then I can move on to another."`,
  },
  "dict.questions.concentrated_02": {
    id: "dict.questions.concentrated_02",
    defaultMessage: `"I am obsessed with goals. If I don't set them, I am lost."`,
  },
  "dict.questions.concentrated_03": {
    id: "dict.questions.concentrated_03",
    defaultMessage: `"Come on, just stay focused!" Is it you who often needs to keep everyone on point?`,
  },
  "dict.questions.lover_of_order_01": {
    id: "dict.questions.lover_of_order_01",
    defaultMessage: `"If you need someone who sets up processes and deadlines, just give me a call."`,
  },
  "dict.questions.lover_of_order_02": {
    id: "dict.questions.lover_of_order_02",
    defaultMessage: `"I need structure and don't like surprises." Is that you?`,
  },
  "dict.questions.lover_of_order_03": {
    id: "dict.questions.lover_of_order_03",
    defaultMessage: `"If the world around me is predictable, then I feel safe that all is under control."`,
  },
  "dict.questions.self_developer_01": {
    id: "dict.questions.self_developer_01",
    defaultMessage: `"My life is all about learning new things." Is that you?`,
  },
  "dict.questions.self_developer_02": {
    id: "dict.questions.self_developer_02",
    defaultMessage: `"Teach me, teach me. I need to learn it all." Are you open to learn new things?`,
  },
  "dict.questions.self_developer_03": {
    id: "dict.questions.self_developer_03",
    defaultMessage: `"I am obsessed about exploring many interests and new paths." `,
  },
  "dict.questions.positive_01": {
    id: "dict.questions.positive_01",
    defaultMessage: `"Stop moaning! Look how beautiful it is." Do you also seek positivity?`,
  },
  "dict.questions.positive_02": {
    id: "dict.questions.positive_02",
    defaultMessage: `"Even if it's cloudy I feel like sun is shining everywhere." Are you a born optimist?`,
  },
  "dict.questions.positive_03": {
    id: "dict.questions.positive_03",
    defaultMessage: `"I can sell enthusiasm. No cynic will drag me down."`,
  },
  "dict.questions.responsible_01": {
    id: "dict.questions.responsible_01",
    defaultMessage: `"When I say I commit to it, I commit to it. You bet I'm responsible."`,
  },
  "dict.questions.responsible_02": {
    id: "dict.questions.responsible_02",
    defaultMessage: `"I accept the consequences of my actions."`,
  },
  "dict.questions.responsible_03": {
    id: "dict.questions.responsible_03",
    defaultMessage: `"I take my commitments seriously."`,
  },
  "dict.questions.self_believer_01": {
    id: "dict.questions.self_believer_01",
    defaultMessage: `"I know I can do great things. I strongly believe in myself!"`,
  },
  "dict.questions.self_believer_02": {
    id: "dict.questions.self_believer_02",
    defaultMessage: `"People might say different things at different times. Yet, I know what I'm capable of!" Is that you?`,
  },
  "dict.questions.self_believer_03": {
    id: "dict.questions.self_believer_03",
    defaultMessage: `"You may disagree, but you won't break me!" Do you believe in yourself?`,
  },
  "dict.questions.solver_01": {
    id: "dict.questions.solver_01",
    defaultMessage: `"We simply need to solve this. No issue will be swept under the rug!"`,
  },
  "dict.questions.solver_02": {
    id: "dict.questions.solver_02",
    defaultMessage: `"I strongly believe I can solve it!" Is that your approach?`,
  },
  "dict.questions.solver_03": {
    id: "dict.questions.solver_03",
    defaultMessage: `"I am a born solver!"`,
  },
  "dict.questions.strategist_01": {
    id: "dict.questions.strategist_01",
    defaultMessage: `I often ask - "What if?" Do you naturally consider consequences and apply strategic thinking?`,
  },
  "dict.questions.strategist_02": {
    id: "dict.questions.strategist_02",
    defaultMessage: `"I check the patterns, see the issues and then take action. Yes, I'm a born Strategist!"`,
  },
  "dict.questions.strategist_03": {
    id: "dict.questions.strategist_03",
    defaultMessage: `"Let's think a few steps ahead. A good strategy is a must." Do you agree?`,
  },
  "dict.questions.intellectual_01": {
    id: "dict.questions.intellectual_01",
    defaultMessage: `"No matter what it's about, I enjoy thinking about it." Does that sound like you?`,
  },
  "dict.questions.intellectual_02": {
    id: "dict.questions.intellectual_02",
    defaultMessage: `"Thinking doesn't bother me. Actually it's something I love doing."`,
  },
  "dict.questions.intellectual_03": {
    id: "dict.questions.intellectual_03",
    defaultMessage: `"Let me think... I spend a lot of time just thinking about things."`,
  },
});

export const useQuestionsDict = () => {
  const intl = useIntl();
  const questions = useMemo(
    () =>
      QUESTIONS_EN.map((q) => ({
        ...q,
        data: {
          ...q.data,
          text: q.data.ts_key
            ? intl.formatMessage({
                id: q.data.ts_key,
                ...messages[q.data.ts_key],
              })
            : "TODO:" + q.data.text,
        },
      })),
    [intl]
  );

  return useMemo(() => ({ questions }), [questions]);
};
