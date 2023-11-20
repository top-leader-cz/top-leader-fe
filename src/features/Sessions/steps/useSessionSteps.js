import { defaultTo, evolve, map, pipe, trim } from "ramda";
import { useCallback, useState } from "react";
import { useMsg } from "../../../components/Msg/Msg";
import { notBlank } from "../EditSession.page";
import { ActionStepsStep } from "./ActionStepsStep";
import { AlignStep } from "./AlignStep";
import { AreaStep } from "./AreaStep";
import { ReflectStep } from "./ReflectStep";
import { SetActionStepsStep } from "./SetActionStepsStep";
import { GoalStep, MotivationStep } from "./TextAreaStep";
import { SESSION_FIELDS } from "./constants";
import { useGoalHints, useMotivationHints } from "./hints";

export const useSteps = ({ steps, initialIndex = 0, initialData = {} }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(initialIndex);
  const [data, setData] = useState(initialData);
  const activeStep = steps[activeStepIndex];

  const handleNext = useCallback((data) => {
    setData(
      (prev) => console.log("handleNext", data, prev) || { ...prev, ...data }
    );
    setActiveStepIndex((i) => i + 1);
  }, []);

  const handleBack = useCallback((data) => {
    setData((prev) => ({ ...prev, ...data }));
    setActiveStepIndex((i) => Math.max(0, i - 1));
  }, []);

  return {
    steps,
    activeStep,
    activeStepIndex: Math.min(activeStepIndex, steps.length - 1),
    setActiveStepIndex,
    isFirst: activeStepIndex === 0,
    isLast: activeStepIndex === steps.length - 1,
    handleNext,
    handleBack,
    data,
    setData,
  };
};

const DEFS = {
  [SESSION_FIELDS.AREA_OF_DEVELOPMENT]: {
    map: pipe(defaultTo(""), trim, Array.of),
  },
  [SESSION_FIELDS.LONG_TERM_GOAL]: {
    map: pipe(defaultTo(""), trim),
    validate: { notBlank: notBlank(0) },
  },
  [SESSION_FIELDS.MOTIVATION]: {
    map: pipe(defaultTo(""), trim),
    validate: { notBlank: notBlank(0) },
  },
  [SESSION_FIELDS.ACTION_STEPS]: { map: map(evolve({ label: trim })) },
  [SESSION_FIELDS.REFLECTION]: {
    map: trim,
    validate: { notBlank: notBlank(0) },
  },
  [SESSION_FIELDS.PREV_ACTION_STEPS]: {},
};

export const useNewSessionSteps = () => {
  const msg = useMsg();

  const goalHints = useGoalHints();
  const motivationHints = useMotivationHints();
  const STEPS = [
    {
      StepComponent: AreaStep,
      fieldDefMap: {
        [SESSION_FIELDS.AREA_OF_DEVELOPMENT]:
          DEFS[SESSION_FIELDS.AREA_OF_DEVELOPMENT],
      },
      label: msg("sessions.new.steps.area.label"),
      caption: msg("sessions.new.steps.area.caption"),
      iconName: "InsertChart",
      heading: msg("sessions.new.steps.area.heading"),
      perex: msg("sessions.new.steps.area.perex"),
    },
    {
      StepComponent: GoalStep,
      fieldDefMap: {
        [SESSION_FIELDS.LONG_TERM_GOAL]: DEFS[SESSION_FIELDS.LONG_TERM_GOAL],
      },
      label: msg("sessions.new.steps.goal.label"),
      caption: msg("sessions.new.steps.goal.caption"),
      iconName: "Adjust",
      heading: msg("sessions.new.steps.goal.heading"),
      perex: msg("sessions.new.steps.goal.perex"),
      focusedList: goalHints,
    },
    {
      StepComponent: MotivationStep,
      fieldDefMap: {
        [SESSION_FIELDS.MOTIVATION]: DEFS[SESSION_FIELDS.MOTIVATION],
      },
      label: msg("sessions.new.steps.motivation.label"),
      caption: msg("sessions.new.steps.motivation.caption"),
      iconName: "RocketLaunch",
      heading: msg("sessions.new.steps.motivation.heading"),
      perex: msg("sessions.new.steps.motivation.perex"),
      focusedList: motivationHints,
    },
    {
      StepComponent: ActionStepsStep,
      fieldDefMap: {
        [SESSION_FIELDS.ACTION_STEPS]: DEFS[SESSION_FIELDS.ACTION_STEPS],
      },
      label: msg("sessions.new.steps.actionsteps.label"),
      caption: msg("sessions.new.steps.actionsteps.caption"),
      iconName: "Explore",
      heading: msg("sessions.new.steps.actionsteps.heading"),
      perex: msg("sessions.new.steps.actionsteps.perex"),
    },
  ];

  return { steps: STEPS };
};

export const useEditSteps = ({ adjust }) => {
  const msg = useMsg();

  const STEPS = [
    {
      StepComponent: AlignStep,
      label: msg("sessions.edit.steps.align.label"),
      caption: msg("sessions.edit.steps.align.caption"),
      iconName: "InsertChart",
      heading: msg("sessions.edit.steps.align.heading"),
      perex: msg("sessions.edit.steps.align.perex"),
    },
    {
      StepComponent: ReflectStep,
      fieldDefMap: {
        [SESSION_FIELDS.REFLECTION]: DEFS[SESSION_FIELDS.REFLECTION],
        [SESSION_FIELDS.PREV_ACTION_STEPS]:
          DEFS[SESSION_FIELDS.PREV_ACTION_STEPS],
      }, // TODO: to enum
      label: msg("sessions.edit.steps.reflect.label"),
      caption: msg("sessions.edit.steps.reflect.caption"),
      iconName: "Lightbulb",
      heading: msg("sessions.edit.steps.reflect.heading"),
      perex: msg("sessions.edit.steps.reflect.perex"),
    },
    {
      StepComponent: SetActionStepsStep,
      fieldDefMap: {
        [SESSION_FIELDS.ACTION_STEPS]: DEFS[SESSION_FIELDS.ACTION_STEPS],
        [SESSION_FIELDS.PREV_ACTION_STEPS]:
          DEFS[SESSION_FIELDS.PREV_ACTION_STEPS],
      },
      label: msg("sessions.edit.steps.setaction.label"),
      caption: msg("sessions.edit.steps.setaction.caption"),
      iconName: "Explore",
      heading: msg("sessions.edit.steps.setaction.heading"),
      perex: msg("sessions.edit.steps.setaction.perex"),
    },
  ];
  const goalHints = useGoalHints();
  const ADJUST_STEPS = [
    {
      StepComponent: AreaStep,
      fieldDefMap: {
        [SESSION_FIELDS.AREA_OF_DEVELOPMENT]:
          DEFS[SESSION_FIELDS.AREA_OF_DEVELOPMENT],
      },
      label: msg("sessions.new.steps.area.label"),
      caption: msg("sessions.new.steps.area.caption"),
      // caption: "InsertChart",
      iconName: "InsertChart",
      heading: msg("sessions.new.steps.area.heading"),
      perex: msg("sessions.new.steps.area.perex"),
    },
    {
      StepComponent: GoalStep,
      fieldDefMap: {
        [SESSION_FIELDS.LONG_TERM_GOAL]: DEFS[SESSION_FIELDS.LONG_TERM_GOAL],
      },
      label: msg("sessions.new.steps.goal.label"),
      caption: msg("sessions.new.steps.goal.caption"),
      // caption: "Adjust",
      iconName: "Adjust",
      heading: msg("sessions.new.steps.goal.heading"),
      perex: msg("sessions.new.steps.goal.perex"),
      focusedList: goalHints,
    },
  ];
  const steps = adjust
    ? [STEPS[0], ADJUST_STEPS[0], ADJUST_STEPS[1], STEPS[1], STEPS[2]]
    : STEPS;

  return { steps };
};
