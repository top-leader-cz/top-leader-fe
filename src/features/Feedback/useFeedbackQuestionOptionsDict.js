import {
  adjust,
  curryN,
  groupBy,
  join,
  map,
  pipe,
  prop,
  replace,
  split,
  toUpper,
} from "ramda";
import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { useFeedbackOptionsQuery } from "./api";
import { getLoadableOptions } from "../Settings/Admin/MemberAdminModal";
import { useMsg } from "../../components/Msg/Msg";

const messages = defineMessages({
  "dict.feedback.question.general.work-in-respectful-manners.label": {
    id: "dict.feedback.question.general.work-in-respectful-manners.label",
    defaultMessage: "Does the person work in a respectful manner to others?",
  },
  "dict.feedback.question.consider-other-team-members.label": {
    id: "dict.feedback.question.consider-other-team-members.label",
    defaultMessage:
      "Does the person consider other team members’ opinions before making a decision?",
  },
  "dict.feedback.question.general.effectively-solve-problems.label": {
    id: "dict.feedback.question.general.effectively-solve-problems.label",
    defaultMessage: "Does the person effectively solve problems?",
  },
  "dict.feedback.question.general.responsive-to-their-team.label": {
    id: "dict.feedback.question.general.responsive-to-their-team.label",
    defaultMessage:
      "Is the person responsive to their team’s needs and questions?",
  },
  "dict.feedback.question.general.work-under-pressure-to-meet-deadlines.label":
    {
      id: "dict.feedback.question.general.work-under-pressure-to-meet-deadlines.label",
      defaultMessage: "Can the person work under pressure to meet deadlines?",
    },
  "dict.feedback.question.general.clear-vision-that-aligns-with-the-organisation.label":
    {
      id: "dict.feedback.question.general.clear-vision-that-aligns-with-the-organisation.label",
      defaultMessage:
        "Does the person provide a clear vision that aligns with the organisation’s objectives?",
    },
  "dict.feedback.question.leadership.provide-solutions.label": {
    id: "dict.feedback.question.leadership.provide-solutions.label",
    defaultMessage:
      "Does the employee provide solutions to difficult customer problems?",
  },
  "dict.feedback.question.leadership.demonstrating-leadership.label": {
    id: "dict.feedback.question.leadership.demonstrating-leadership.label",
    defaultMessage:
      "Is the employee demonstrating leadership on a daily basis?",
  },
  "dict.feedback.question.leadership.accountability-for-the-work.label": {
    id: "dict.feedback.question.leadership.accountability-for-the-work.label",
    defaultMessage:
      "Does the employee take accountability for their work and carry it out meeting the deadline?",
  },
  "dict.feedback.question.leadership.others-look-to-help.label": {
    id: "dict.feedback.question.leadership.others-look-to-help.label",
    defaultMessage:
      "Do other team members look to the employee to help them with their work?",
  },
  "dict.feedback.question.leadership.duties-without-issues.label": {
    id: "dict.feedback.question.leadership.duties-without-issues.label",
    defaultMessage: "Does the employee carry out duties without issue?",
  },
  "dict.feedback.question.leadership.bring-ideas.label": {
    id: "dict.feedback.question.leadership.bring-ideas.label",
    defaultMessage:
      "Does the employee bring ideas to the table when problem-solving and Brainstorming?",
  },
  "dict.feedback.question.leadership.supervise-work.label": {
    id: "dict.feedback.question.leadership.supervise-work.label",
    defaultMessage: "Does the employee supervise work to an effective level?",
  },
  "dict.feedback.question.communication.listen-well.label": {
    id: "dict.feedback.question.communication.listen-well.label",
    defaultMessage: "Does this employee listen well to others’ suggestions?",
  },
  "dict.feedback.question.communication.communicate-effectively.label": {
    id: "dict.feedback.question.communication.communicate-effectively.label",
    defaultMessage:
      "Does the employee communicate effectively with customers/managers/peers?",
  },
  "dict.feedback.question.communication.ask-for-more-information.label": {
    id: "dict.feedback.question.communication.ask-for-more-information.label",
    defaultMessage:
      "Does the employee ask for more information if they do not understand something?",
  },
  "dict.feedback.question.communication.communicate-well-in-writing.label": {
    id: "dict.feedback.question.communication.communicate-well-in-writing.label",
    defaultMessage:
      "Does the employee communicate well in writing with good grammar and spelling?",
  },
  "dict.feedback.question.communication.speak-clearly.label": {
    id: "dict.feedback.question.communication.speak-clearly.label",
    defaultMessage: "Does the employee speak in a clear and concise way?",
  },
  "dict.feedback.question.communication.ideas-to-others.label": {
    id: "dict.feedback.question.communication.ideas-to-others.label",
    defaultMessage:
      "Does the employee effectively communicate their ideas to others?",
  },
  "dict.feedback.question.communication.opportunity-for-discussion.label": {
    id: "dict.feedback.question.communication.opportunity-for-discussion.label",
    defaultMessage:
      "Does the employee create opportunities for discussion and dialogue?",
  },
  "dict.feedback.question.interpersonal.work-well-with-others.label": {
    id: "dict.feedback.question.interpersonal.work-well-with-others.label",
    defaultMessage: "Does this employee work well with others on tasks?",
  },
  "dict.feedback.question.interpersonal.show-respect.label": {
    id: "dict.feedback.question.interpersonal.show-respect.label",
    defaultMessage: "Does this employee show respect to others in their team?",
  },
  "dict.feedback.question.interpersonal.manage-the-emotions.label": {
    id: "dict.feedback.question.interpersonal.manage-the-emotions.label",
    defaultMessage:
      "Does the employee manage the emotions and keep them in check?",
  },
  "dict.feedback.question.interpersonal.manage-the-stress.label": {
    id: "dict.feedback.question.interpersonal.manage-the-stress.label",
    defaultMessage: "Does the employee effectively manage their stress levels?",
  },
  "dict.feedback.question.interpersonal.have-conflict-with-others.label": {
    id: "dict.feedback.question.interpersonal.have-conflict-with-others.label",
    defaultMessage: "Does the employee regularly have conflict with others?",
  },
  "dict.feedback.question.interpersonal.exhibit-the-core-values.label": {
    id: "dict.feedback.question.interpersonal.exhibit-the-core-values.label",
    defaultMessage:
      "Does the employee exhibit the core people values of the organisation?",
  },
  "dict.feedback.question.interpersonal.collaborate-with-others.label": {
    id: "dict.feedback.question.interpersonal.collaborate-with-others.label",
    defaultMessage:
      "Does the employee collaborate with others effectively in a team?",
  },
  "dict.feedback.question.interpersonal.other-staff-will-turn-to.label": {
    id: "dict.feedback.question.interpersonal.other-staff-will-turn-to.label",
    defaultMessage:
      "Is this employee someone that other staff will turn to for advice?",
  },
  "dict.feedback.question.problemsolving.effective-at-evaluating.label": {
    id: "dict.feedback.question.problemsolving.effective-at-evaluating.label",
    defaultMessage: "Is the employee effective at evaluating a problem?",
  },
  "dict.feedback.question.problemsolving.suggest-useful-solutions.label": {
    id: "dict.feedback.question.problemsolving.suggest-useful-solutions.label",
    defaultMessage: "Does the employee suggest useful solutions to a problem?",
  },
  "dict.feedback.question.problemsolving.recognize-problem.label": {
    id: "dict.feedback.question.problemsolving.recognize-problem.label",
    defaultMessage: "Does the employee recognise when there is a problem?",
  },
  "dict.feedback.question.problemsolving.communicate-the-problem-to-others.label":
    {
      id: "dict.feedback.question.problemsolving.communicate-the-problem-to-others.label",
      defaultMessage:
        "Does the employee effectively communicate the problem to others and bring them on board?",
    },
  "dict.feedback.question.problemsolving.work-independently.label": {
    id: "dict.feedback.question.problemsolving.work-independently.label",
    defaultMessage:
      "Is the employee able to work independently to fix a problem?",
  },
  "dict.feedback.question.problemsolving.feel-confident-in-exploring-problem.label":
    {
      id: "dict.feedback.question.problemsolving.feel-confident-in-exploring-problem.label",
      defaultMessage:
        "Does the employee feel confident in exploring problems without assistance?",
    },
  "dict.feedback.question.problemsolving.provide-creative-solution.label": {
    id: "dict.feedback.question.problemsolving.provide-creative-solution.label",
    defaultMessage: "Does the employee provide creative solutions to problems?",
  },
  "dict.feedback.question.problemsolving.understand-the-impacts-and-dependencies.label":
    {
      id: "dict.feedback.question.problemsolving.understand-the-impacts-and-dependencies.label",
      defaultMessage:
        "Does the employee understand the impacts and dependencies of a problem?",
    },
  "dict.feedback.question.organizational.know-goals.label": {
    id: "dict.feedback.question.organizational.know-goals.label",
    defaultMessage: "Does the employee know about the organisation goals?",
  },
  "dict.feedback.question.organizational.know-strategic-vision.label": {
    id: "dict.feedback.question.organizational.know-strategic-vision.label",
    defaultMessage:
      "Does the employee know about the organisation’s strategic vision?",
  },
  "dict.feedback.question.organizational.live-values.label": {
    id: "dict.feedback.question.organizational.live-values.label",
    defaultMessage: "Does the employee live the company values daily?",
  },
  "dict.feedback.question.organizational.active-in-meetings.label": {
    id: "dict.feedback.question.organizational.active-in-meetings.label",
    defaultMessage: "Is the employee active in meetings?",
  },
  "dict.feedback.question.organizational.recmmend-the-company.label": {
    id: "dict.feedback.question.organizational.recmmend-the-company.label",
    defaultMessage: "Does the employee recommend the company to customers?",
  },
  "dict.feedback.question.organizational.showing-engagement.label": {
    id: "dict.feedback.question.organizational.showing-engagement.label",
    defaultMessage:
      "Is the employee showing engagement with the organisation goals?",
  },
  "dict.feedback.question.organizational.provide-feedback-about-ideas.label": {
    id: "dict.feedback.question.organizational.provide-feedback-about-ideas.label",
    defaultMessage:
      "Does the employee actively provide feedback about the organisation's ideas or activities?",
  },
  "dict.feedback.question.motivation.appear-motivated-by-their-job.label": {
    id: "dict.feedback.question.motivation.appear-motivated-by-their-job.label",
    defaultMessage: "Does the employee appear to be motivated by their job?",
  },
  "dict.feedback.question.motivation.communicate-motivated.label": {
    id: "dict.feedback.question.motivation.communicate-motivated.label",
    defaultMessage:
      "Does the employee communicate that they are motivated with their job?",
  },
  "dict.feedback.question.motivation.difficullt-to-motivate.label": {
    id: "dict.feedback.question.motivation.difficullt-to-motivate.label",
    defaultMessage: "Is the employee difficult to motivate to do a task?",
  },
  "dict.feedback.question.motivation.level-of-motivation.label": {
    id: "dict.feedback.question.motivation.level-of-motivation.label",
    defaultMessage: "What is the level of motivation that the employee shows?",
  },
  "dict.feedback.question.motivation.share-their-work.label": {
    id: "dict.feedback.question.motivation.share-their-work.label",
    defaultMessage:
      "Is the employee motivated to independently share their work with others?",
  },
  "dict.feedback.question.motivation.motivate-others.label": {
    id: "dict.feedback.question.motivation.motivate-others.label",
    defaultMessage: "Does the employee motivate others in a group task?",
  },
  "dict.feedback.question.efficiency.complete-their-tasks.label": {
    id: "dict.feedback.question.efficiency.complete-their-tasks.label",
    defaultMessage: "Does the employee complete their tasks effectively?",
  },
  "dict.feedback.question.efficiency.sense-of-collaboration.label": {
    id: "dict.feedback.question.efficiency.sense-of-collaboration.label",
    defaultMessage:
      "Does the employee create a sense of collaboration when working with others?",
  },
  "dict.feedback.question.efficiency.daily-work-effectively.label": {
    id: "dict.feedback.question.efficiency.daily-work-effectively.label",
    defaultMessage: "Does the employee deal with daily work tasks effectively?",
  },
  "dict.feedback.question.efficiency.work-finished-right.label": {
    id: "dict.feedback.question.efficiency.work-finished-right.label",
    defaultMessage:
      "Is the employee’s work finished to the right level every time?",
  },
  "dict.feedback.question.efficiency.work-on-time.label": {
    id: "dict.feedback.question.efficiency.work-on-time.label",
    defaultMessage: "Does the employee complete their work on time?",
  },
  "dict.feedback.question.efficiency.maintain-high-standards.label": {
    id: "dict.feedback.question.efficiency.maintain-high-standards.label",
    defaultMessage: "Does the employee maintain high standards in their work?",
  },
  "dict.feedback.question.efficiency.exceed-expectations.label": {
    id: "dict.feedback.question.efficiency.exceed-expectations.label",
    defaultMessage: "Does the employee exceed expectations with their work?",
  },
  "dict.feedback.question.efficiency.improve-processes.label": {
    id: "dict.feedback.question.efficiency.improve-processes.label",
    defaultMessage:
      "Does the employee improve processes to make them more effective?",
  },

  "dict.feedback-questions-categories.general": {
    id: "dict.feedback-questions-categories.general",
    defaultMessage: "General",
  },
  "dict.feedback-questions-categories.consider-other-team-members": {
    id: "dict.feedback-questions-categories.consider-other-team-members",
    defaultMessage: "Consider other team members",
  },
  "dict.feedback-questions-categories.leadership": {
    id: "dict.feedback-questions-categories.leadership",
    defaultMessage: "Leadership",
  },
  "dict.feedback-questions-categories.communication": {
    id: "dict.feedback-questions-categories.communication",
    defaultMessage: "Communication",
  },
  "dict.feedback-questions-categories.interpersonal": {
    id: "dict.feedback-questions-categories.interpersonal",
    defaultMessage: "Interpersonal",
  },
  "dict.feedback-questions-categories.problemsolving": {
    id: "dict.feedback-questions-categories.problemsolving",
    defaultMessage: "Problemsolving",
  },
  "dict.feedback-questions-categories.organizational": {
    id: "dict.feedback-questions-categories.organizational",
    defaultMessage: "Organizational",
  },
  "dict.feedback-questions-categories.motivation": {
    id: "dict.feedback-questions-categories.motivation",
    defaultMessage: "Motivation",
  },
  "dict.feedback-questions-categories.efficiency": {
    id: "dict.feedback-questions-categories.efficiency",
    defaultMessage: "Efficiency",
  },
});

const translateOption = curryN(2, (intl, apiKey) => {
  const getId = (prop) => `dict.feedback.${apiKey}.${prop}`;
  const tsKey = getId("label");
  const tsObj = messages[tsKey];

  if (!tsObj) {
    console.error("Missing translation", { apiKey, tsKey, messages });
    return {
      value: apiKey,
      label: `${apiKey}`,
      missing: { apiKey, tsKey },
    };
  }

  return {
    value: apiKey,
    label: intl.formatMessage({ ...tsObj }),
  };
});

export const useFeedbackQuestionOptionsDict = ({ apiKeys = [] }) => {
  const intl = useIntl();
  const feedbackQuestionOptions = useMemo(
    () => pipe(map((k) => translateOption(intl, k)))(apiKeys),
    [apiKeys, intl]
  );

  return useMemo(
    () => ({ feedbackQuestionOptions }),
    [feedbackQuestionOptions]
  );
};

const formatOptionsCategory = pipe(
  split(""),
  adjust(0, toUpper),
  join(""),
  replace(/-/g, " ")
);

// TODO: use everywhere
export const useFeedbackOptions = () => {
  const msg = useMsg({ dict: messages });
  const intl = useIntl();
  const query = useFeedbackOptionsQuery();

  const optionsProps = useMemo(() => {
    const props = getLoadableOptions({
      query,
      map: pipe(prop("options"), map(prop("key")), map(translateOption(intl))),
    });
    const groupedOptions = groupBy(({ value }) => {
      const cat = value?.split(".")?.[1] ?? "";
      return cat
        ? msg.maybe(`dict.feedback-questions-categories.${cat}`) ||
            formatOptionsCategory(cat)
        : "";
    }, props.options);
    return { ...props, groupedOptions };
  }, [intl, msg, query]);

  return { query, optionsProps };
};
