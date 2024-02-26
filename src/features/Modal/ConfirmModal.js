import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  Snackbar,
} from "@mui/material";
import {
  adjust,
  always,
  applySpec,
  evolve,
  findIndex,
  identity,
  pick,
  pipe,
  propEq,
  reject,
} from "ramda";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { v4 as uuid } from "uuid";
import { Icon } from "../../components/Icon";
import { H2, P } from "../../components/Typography";

// const CONFIRM_MODAL_TYPE = {
//   INFO: "INFO",
//   ERROR: "ERROR",
// };

export const ConfirmModal = ({
  open,
  onClose,
  iconName,
  title,
  desc,
  children,
  buttons,
  noDivider,
  error,
  // type = CONFIRM_MODAL_TYPE.INFO,
  sx = {},
}) => {
  // const color = {
  //   [CONFIRM_MODAL_TYPE.INFO]: "primary",
  //   [CONFIRM_MODAL_TYPE.ERROR]: "error",
  // }[type];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "800px" },
          bgcolor: "background.paper",
          borderRadius: "6px",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          ...sx,
          // border: "2px solid #000",
          // boxShadow: 24,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Avatar sx={{ bgcolor: "#F9FAFB", width: 48, height: 48 }}>
            <Avatar sx={{ bgcolor: "#EAECF0", width: 36, height: 36 }}>
              <Icon name={iconName} sx={{ color: "#667085" }} />
            </Avatar>
          </Avatar>
          <IconButton onClick={onClose}>
            <Icon name="Close" sx={{ color: "#667085" }} />
          </IconButton>
        </Box>
        {!error?.message ? null : (
          <Alert severity="error" sx={{ my: 2 }}>
            {error?.message}
          </Alert>
        )}
        {title && (
          <H2 id="modal-modal-title" {...(title?.props ?? {})}>
            {title?.children ?? title}
          </H2>
        )}
        {desc && (
          <P id="modal-modal-description" {...(desc?.props ?? {})}>
            {desc?.children ?? desc}
          </P>
        )}
        {children}
        {!noDivider && <Divider flexItem />}
        {buttons && (
          <Box display="flex" flexDirection="row" gap={3}>
            {buttons.map(({ Component = Button, ...button }) => (
              <Component key={JSON.stringify(button)} fullWidth {...button} />
            ))}
          </Box>
        )}
      </Paper>
    </Modal>
  );
};

export const TLSnackbar = ({ open, onClose, type, ...rest }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    onClose();
  };
  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <Icon name={"Close"} />
    </IconButton>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      action={action}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      {...rest}
    >
      {type ? (
        <Alert severity={type} action={action}>
          {rest.message}
        </Alert>
      ) : null}
    </Snackbar>
  );
};

export const ModalCtx = React.createContext({
  updateItem: () => console.error("[ModalCtx.updateItem] missing context"),
  destroyItem: () => console.error("[ModalCtx.destroyItem] missing context"),
});
export const SnackbarCtx = React.createContext({
  updateItem: () => console.error("[SnackbarCtx.updateItem] missing context"),
  destroyItem: () => console.error("[SnackbarCtx.destroyItem] missing context"),
});

const ACTION = {
  UPDATE: "UPDATE",
  DESTROY: "DESTROY",
};
const INITIAL_STATE = {
  stack: [],
};

const adjustStack = (payload) => (stack) => {
  const index = findIndex(propEq("id", payload.id))(stack);
  if (index === -1) return [...stack, payload];
  else return adjust(index, (item) => ({ ...item, ...payload }), stack);
};

const reducer = (state, { payload, type }) => {
  // console.log("reducer", type, { payload, type, state });
  switch (type) {
    case ACTION.UPDATE:
      return evolve({ stack: adjustStack(payload) }, state);
    case ACTION.DESTROY:
      return evolve({ stack: reject(propEq("id", payload.id)) }, state);
    default:
      return state;
  }
};

export const mapModalExtraProps = ({ buttons, getButtons }, { onClose }) => ({
  buttons: getButtons?.({ onClose }) || buttons,
});

export const mapSnackbarExtraProps = (item, { onClose }) => ({});

export const StackProvider = ({
  Ctx = ModalCtx,
  ItemComponent = ConfirmModal,
  logAs = "StackProvider",
  children,
  mapExtraProps,
}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { stack } = state;

  const mapProps = useCallback(
    ({ onClose: onCloseProp, ...item }) => {
      const onClose = () => {
        dispatch({
          type: ACTION.UPDATE,
          payload: { id: item.id, open: false },
        });
        onCloseProp?.();
      };
      const mapped = {
        ...item,
        open: item.open ?? false,
        key: item.id,
        onClose,
        ...mapExtraProps?.(item, { onClose }),
      };

      return mapped;
    },
    [mapExtraProps]
  );

  const stackRef = useRef(stack);
  stackRef.current = stack;

  const ctx = useMemo(
    () => ({
      updateItem: pipe(
        applySpec({ type: always(ACTION.UPDATE), payload: identity }),
        dispatch
      ),
      destroyItem: pipe(
        applySpec({
          type: always(ACTION.DESTROY),
          payload: pick(["id"]),
        }),
        dispatch
      ),
    }),
    []
  );
  console.log(`[${logAs}.rndr]`, { Ctx, ctx, stack, ItemComponent });

  return (
    <Ctx.Provider value={ctx}>
      {children}
      <div style={{ position: "absolute" }}>
        {stack.map((item) => (
          <ItemComponent {...mapProps(item)} />
        ))}
      </div>
    </Ctx.Provider>
  );
};

const obj = {};
export const useModal = (modal = obj) => {
  const id = useRef(uuid());
  const { updateItem, destroyItem } = useContext(ModalCtx);

  useEffect(() => {
    const withId = { ...modal, id: id.current };
    // console.log("[useModal eff]", { withId });
    updateItem(withId);
  }, [modal, updateItem]);

  useEffect(
    () => () => {
      destroyItem({ id: id.current });
    },
    [destroyItem]
  );

  return {
    show: useCallback(
      () => updateItem({ id: id.current, open: true }),
      [updateItem]
    ),
  };
};
ConfirmModal.useModal = useModal;

export const useSnackbar = (
  snackbar = obj,
  { destroyOnUnmount = false } = obj
) => {
  const id = useRef(uuid());
  const { updateItem, destroyItem } = useContext(SnackbarCtx);

  useEffect(() => {
    const withId = { ...snackbar, id: id.current };
    updateItem(withId);
  }, [snackbar, updateItem]);

  const destroyOnUnmountRef = useRef(destroyOnUnmount);
  destroyOnUnmountRef.current = destroyOnUnmount;
  useEffect(
    () => () => {
      if (destroyOnUnmountRef.current) destroyItem({ id: id.current });
    },
    [destroyItem]
  );

  return {
    show: useCallback(
      (item = {}) => updateItem({ id: id.current, open: true, ...item }),
      [updateItem]
    ),
  };
};
