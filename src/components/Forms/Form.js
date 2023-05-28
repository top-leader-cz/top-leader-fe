import { FormProvider, useForm } from "react-hook-form";

const onSubmitDefault = (data, e) => console.log("[onSubmit]", data, e);
const onErrorDefault = (errors, e) => console.log("[onError]", errors, e);

export const RHForm = ({
  children,
  form: formProp,
  onSubmit = onSubmitDefault,
  onError = onErrorDefault,
  ...props
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = formProp ? formProp : useForm(props);

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FormProvider {...form}>{children}</FormProvider>
    </form>
  );
};
