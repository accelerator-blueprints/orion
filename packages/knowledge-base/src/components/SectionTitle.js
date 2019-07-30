import React from 'react'
import { withStyles, Typography } from '@material-ui/core'
import T from 'prop-types'

function SectionTitle({ classes, barColor, ...props }) {
  return (
    <div>
      <div className={classes.bar} style={{ backgroundColor: barColor }} />
      <Typography variant="h3" {...props} />
    </div>
  )
}

SectionTitle.propTypes = {
  ...Typography.propTypes,
  barColor: T.string.isRequired,
}

const styles = theme => ({
  bar: {
    height: theme.spacing(1),
    width: '100%',
    marginBottom: theme.spacing(0.5),
  },
})

export default withStyles(styles)(SectionTitle)