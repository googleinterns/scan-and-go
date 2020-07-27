import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      fontSize: theme.typography.h4.fontSize,
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.h3.fontSize,
      },
    },
  })
);
