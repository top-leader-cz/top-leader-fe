import { map, pipe } from "ramda";
import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  "dict.fields.business.label": {
    id: "dict.fields.business.label",
    defaultMessage: "Business",
  },
  "dict.fields.career.label": {
    id: "dict.fields.career.label",
    defaultMessage: "Career",
  },
  "dict.fields.change.label": {
    id: "dict.fields.change.label",
    defaultMessage: "Change",
  },
  "dict.fields.communication.label": {
    id: "dict.fields.communication.label",
    defaultMessage: "Communication",
  },
  "dict.fields.confidence.label": {
    id: "dict.fields.confidence.label",
    defaultMessage: "Confidence",
  },
  "dict.fields.conflict.label": {
    id: "dict.fields.conflict.label",
    defaultMessage: "Conflict",
  },
  "dict.fields.diversity.label": {
    id: "dict.fields.diversity.label",
    defaultMessage: "Diversity",
  },
  "dict.fields.entrepreneurship.label": {
    id: "dict.fields.entrepreneurship.label",
    defaultMessage: "Entrepreneurship",
  },
  "dict.fields.executive.label": {
    id: "dict.fields.executive.label",
    defaultMessage: "Executive",
  },
  "dict.fields.facilitation.label": {
    id: "dict.fields.facilitation.label",
    defaultMessage: "Facilitation",
  },
  "dict.fields.fitness.label": {
    id: "dict.fields.fitness.label",
    defaultMessage: "Fitness",
  },
  "dict.fields.health.label": {
    id: "dict.fields.health.label",
    defaultMessage: "Health",
  },
  "dict.fields.leadership.label": {
    id: "dict.fields.leadership.label",
    defaultMessage: "Leadership",
  },
  "dict.fields.life.label": {
    id: "dict.fields.life.label",
    defaultMessage: "Life",
  },
  "dict.fields.management.label": {
    id: "dict.fields.management.label",
    defaultMessage: "Management",
  },
  "dict.fields.mental_fitness.label": {
    id: "dict.fields.mental_fitness.label",
    defaultMessage: "Mental fitness",
  },
  "dict.fields.mentorship.label": {
    id: "dict.fields.mentorship.label",
    defaultMessage: "Mentorship",
  },
  "dict.fields.negotiations.label": {
    id: "dict.fields.negotiations.label",
    defaultMessage: "Negotiations",
  },
  "dict.fields.organizational_development.label": {
    id: "dict.fields.organizational_development.label",
    defaultMessage: "Organizational Development",
  },
  "dict.fields.performance.label": {
    id: "dict.fields.performance.label",
    defaultMessage: "Performance",
  },
  "dict.fields.relationships.label": {
    id: "dict.fields.relationships.label",
    defaultMessage: "Relationships",
  },
  "dict.fields.sales.label": {
    id: "dict.fields.sales.label",
    defaultMessage: "Sales",
  },
  "dict.fields.teams.label": {
    id: "dict.fields.teams.label",
    defaultMessage: "Teams",
  },
  "dict.fields.time_management.label": {
    id: "dict.fields.time_management.label",
    defaultMessage: "Time Management",
  },
  "dict.fields.transformations.label": {
    id: "dict.fields.transformations.label",
    defaultMessage: "Transformations",
  },
  "dict.fields.wellbeing.label": {
    id: "dict.fields.wellbeing.label",
    defaultMessage: "Wellbeing",
  },
  "dict.fields.women.label": {
    id: "dict.fields.women.label",
    defaultMessage: "Women",
  },
});

const translateField = (intl, value) => {
  const getId = (prop) => `dict.fields.${value}.${prop}`;

  return {
    value,
    label: intl.formatMessage({ ...messages[getId("label")] }),
  };
};

const fieldsKeys = [
  "business",
  "career",
  "change",
  "communication",
  "confidence",
  "conflict",
  "diversity",
  "entrepreneurship",
  "executive",
  "facilitation",
  "fitness",
  "health",
  "leadership",
  "life",
  "management",
  "mental_fitness",
  "mentorship",
  "negotiations",
  "organizational_development",
  "performance",
  "relationships",
  "sales",
  "teams",
  "time_management",
  "transformations",
  "wellbeing",
  "women",
];

export const useFieldsDict = () => {
  // const { language, setLanguage } = useContext(I18nContext);
  const intl = useIntl();
  const fieldsOptions = useMemo(
    () => pipe(map((k) => translateField(intl, k)))(fieldsKeys),
    [intl]
  );

  return useMemo(() => ({ fieldsOptions }), [fieldsOptions]);
};
