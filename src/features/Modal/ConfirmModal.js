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
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Icon } from "../../components/Icon";
import { H2, P } from "../../components/Typography";
import {
  always,
  applySpec,
  assoc,
  concat,
  evolve,
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
  sx = {},
}) => {
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
  SET_MODAL: "SET_MODAL",
  ON_CLOSE: "ON_CLOSE",
  DESTROY: "DESTROY",
};

const INITIAL_STATE = {
  stack: [],
};

const updateStack = (payload) => (stack) => {
  const index = findIndex(propEq("id", payload.id))(stack);
  if (index === -1) return [...stack, payload];
  else return update(index, payload, stack);
};

const reducer = (state, { payload, type }) => {
  switch (type) {
    case ACTION.SET_MODAL:
      return evolve({ stack: updateStack(payload) }, state);
    case ACTION.ON_CLOSE:
    case ACTION.DESTROY:
      return evolve({ stack: reject(propEq("id", payload.id)) }, state);
    // case ACTION.ON_CLOSE: return evolve( { stack: (stack) => { return pipe( prop("payload"), assoc("open", false), updateStack )(action)(stack); }, }, state );
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
          type: ACTION.ON_CLOSE,
          payload: modal,
        });
        onCloseProp?.();
      };
      return {
        ...modal,
        key: modal.id,
        buttons: getButtons?.({ onClose }) || modal.buttons,
        onClose,
      };
    },
    []
  );

  const ctx = useMemo(
    () => ({
      destroyModal: pipe(
        applySpec({ type: always(ACTION.DESTROY), payload: pick(["id"]) }),
        dispatch
      ),
      setModal: pipe(
        applySpec({ type: always(ACTION.SET_MODAL), payload: identity }),
        dispatch
      ),
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
  const [open, _setOpen] = useState(false);
  const setOpen = useCallback(
    (open) => {
      console.log("[useModal setOpen]", open, modal?.desc);
      _setOpen(open);
    },
    [modal?.desc]
  );
  const { setModal, destroyModal } = React.useContext(ModalCtx);
  const id = useRef(uuid());

  console.log("[useModal rndr]", open, { modal, id: id.current });
  useEffect(() => {
    const newModal = { ...modal, open, id: id.current };
    console.log("[useModal eff]", open, { modal, newModal });

    if (open) {
      debugger;
      setModal(newModal);
    } else {
      destroyModal({ id: id.current });
    }
  }, [destroyModal, modal, open, setModal]);

  useEffect(
    () => () => {
      destroyModal({ id: id.current });
    },
    [destroyModal]
  );

  return { show: () => setOpen(true) };
};
ConfirmModal.useModal = useModal;
