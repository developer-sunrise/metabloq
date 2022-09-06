import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  Slide
} from "@material-ui/core";
import clsx from "clsx";
import red from "@material-ui/core/colors/red";

const useStyles = makeStyles(() => ({
  dialog: {
    borderRadius: ".5em",
    padding:"1em"
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SessionTimeoutDialog = ({  open, countdown, onLogout,onContinue }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      classes={{ paper: classes.dialog }}
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <h4 className="text-center">Session Timeout</h4>
      </DialogTitle>
      <DialogContent>
        <span >
          The current session is about to expire in{" "}
          <span className={classes.countdown}>{countdown}</span> seconds.
        </span>
        <span>{`Would you like to continue the session?`}</span>
      </DialogContent>
      <DialogActions>
        <button
          onClick={onLogout}
          variant="contained"
          className={clsx("metablog_gradient-button")}
        >
          Logout
        </button>
        <button
          onClick={onContinue}
          className="metablog_primary-filled-button"
        >
          Continue Session
        </button>
      </DialogActions>
    </Dialog>
  );
}


export default SessionTimeoutDialog;