export const INPUT_TYPES = {
  TEXT: "PARAGRAPH",
  SCALE: "SCALE",
};

export const FEEDBACK_FIELDS = {
  title: "title",
  description: "description",
  fields: "fields",
};

export const SUBFIELDS = {
  title: "title",
  inputType: "inputType",
  required: "required",
};

export const SUBFIELD_DEFAULT_VALUES = {
  //   title: "question.general.work-in-respectful-manners",
  title: "",
  inputType: INPUT_TYPES.TEXT,
  required: true,
};

export const DEFAULT_VALUES = {
  //   title: "MM feedback",
  title: "",
  description: "",
  fields: [SUBFIELD_DEFAULT_VALUES],
};

export const EXTERNAL_FEEDBACK_FIELDS = {
  answers: "answers",
};
