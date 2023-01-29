import { FormProvider, useForm } from "react-hook-form";

const onSubmitDefault = (data, e) => console.log("[onSubmit]", data, e);
const onErrorDefault = (errors, e) => console.log("[onError]", errors, e);

export const Form = ({
  children,
  form,
  onSubmit = onSubmitDefault,
  onError = onErrorDefault,
  ...props
}) => {
  //   const form = useForm(props);

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FormProvider {...form}>{children}</FormProvider>
    </form>
  );
};
