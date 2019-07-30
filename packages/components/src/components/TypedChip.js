import React from 'react'
import T from 'prop-types'
import { withStyles, Chip, Typography } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import ClearIcon from '@material-ui/icons/Clear'

export const PARTICIPANT_TYPE = {
  assessor: 'Assessor',
  contributor: 'Contributor',
}

function TypedChip({ type, color, name, onDelete, classes }) {
  return (
    <Chip
      onDelete={onDelete}
      deleteIcon={<ClearIcon fontSize="small" />}
      classes={classes}
      clickable={false}
      label={
        <>
          <Typography className={'name'}>{name}</Typography>
          <Typography variant="h4" className={classes.type} color={color}>
            {type}
          </Typography>
        </>
      }
    />
  )
}

TypedChip.propTypes = {
  name: T.string.isRequired,
  classes: T.object,
  color: T.oneOf(['primary', 'secondary']),
  type: T.string,
  onDelete: T.func,
}

const styles = theme => ({
  root: {
    height: '40px',
    borderRadius: '20px',
    backgroundColor: theme.palette.background.light,
    color: theme.palette.text.primary,
  },
  colorPrimary: {
    backgroundColor: fade(theme.palette.primary.light, 0.1),
  },
  deleteIcon: {
    width: '16px',
  },
  deletable: {
    '&:focus': {
      backgroundColor: theme.palette.background.light,
    },
  },
  type: {
    fontSize: '10px',
    fontWeight: 'bold',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    paddingRight: theme.spacing(2),
    '& > * ': {
      marginLeft: theme.spacing(1),
    },
    '& > .name': {
      textTransform: 'none',
      color: theme.palette.primary.dark,
      fontSize: '14px',
      fontWeight: 'bold',
    },
  },
})

export default withStyles(styles, { withTheme: true })(TypedChip)