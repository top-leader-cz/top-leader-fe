import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Icon } from "../../components/Icon";
import { H2, P } from "../../components/Typography";
import {
  adjust,
  always,
  applySpec,
  assoc,
  concat,
  evolve,
  find,
  findIndex,
  identity,
  ifElse,
  lte,
  map,
  pick,
  pipe,
  prop,
  propEq,
  reject,
  update,
  when,
} from "ramda";
import { v4 as uuid } from "uuid";
import { useStaticCallback } from "../../hooks/useStaticCallback.hook";

const CONFIRM_MODAL_TYPE = {
  INFO: "INFO",
  ERROR: "ERROR",
};

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

export const ModalCtx = React.createContext({});

const ACTION = {
  UPDATE_MODAL: "UPDATE_MODAL",
  DESTROY_MODAL: "DESTROY_MODAL",
};
const INITIAL_STATE = {
  stack: [],
};

const adjustStack = (payload) => (stack) => {
  const index = findIndex(propEq("id", payload.id))(stack);
  if (index === -1) return [...stack, payload];
  else return adjust(index, (modal) => ({ ...modal, ...payload }), stack);
};

const reducer = (state, { payload, type }) => {
  // console.log("reducer", type, { payload, type, state });
  switch (type) {
    case ACTION.UPDATE_MODAL:
      return evolve({ stack: adjustStack(payload) }, state);
    case ACTION.DESTROY_MODAL:
      return evolve({ stack: reject(propEq("id", payload.id)) }, state);
    default:
      return state;
  }
};

export const ModalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { stack } = state;

  const mapProps = useCallback(
    ({ getButtons, onClose: onCloseProp, ...modal }) => {
      const onClose = () => {
        dispatch({
          type: ACTION.UPDATE_MODAL,
          payload: { id: modal.id, open: false },
        });
        onCloseProp?.();
      };
      const mapped = {
        ...modal,
        open: modal.open ?? false,
        key: modal.id,
        buttons: getButtons?.({ onClose }) || modal.buttons,
        onClose,
      };

      return mapped;
    },
    []
  );

  const stackRef = useRef(stack);
  stackRef.current = stack;

  const ctx = useMemo(
    () => ({
      updateModal: pipe(
        applySpec({ type: always(ACTION.UPDATE_MODAL), payload: identity }),
        dispatch
      ),
      destroyModal: pipe(
        applySpec({
          type: always(ACTION.DESTROY_MODAL),
          payload: pick(["id"]),
        }),
        dispatch
      ),
      getModalStatic: ({ id }) => find(propEq("id", id))(stackRef.current),
    }),
    []
  );
  console.log("[ModalProvider.rndr]", { ctx, stack });

  return (
    <ModalCtx.Provider value={ctx}>
      <>
        {children}
        {stack.map((modal) => (
          <ConfirmModal {...mapProps(modal)} />
        ))}
      </>
    </ModalCtx.Provider>
  );
};

const useModal = ({ modal }) => {
  const id = useRef(uuid());
  const { updateModal, destroyModal } = useContext(ModalCtx);

  useEffect(() => {
    const withId = { ...modal, id: id.current };
    // console.log("[useModal eff]", { withId });
    updateModal(withId);
  }, [modal, updateModal]);

  useEffect(
    () => () => {
      destroyModal({ id: id.current });
    },
    [destroyModal]
  );

  return {
    show: useCallback(
      () => updateModal({ id: id.current, open: true }),
      [updateModal]
    ),
  };
};
ConfirmModal.useModal = useModal;
