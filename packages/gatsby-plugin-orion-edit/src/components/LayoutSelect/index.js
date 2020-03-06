import React from 'react'
import T from 'prop-types'
import { Button, Typography, makeStyles } from '@material-ui/core'
import { useEditComponents } from '../EditComponentProvider'

const useStyles = makeStyles(theme => ({
  layouts: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  layout: {
    padding: 16,
    backgroundColor: theme.palette.grey['100'],
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '33%',
  },
  example: {
    boxShadow: theme.shadows[2],
    width: 128,
    height: 150,
    overflow: 'hidden',
  },
  name: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    margin: 8,
  },
}))

function LayoutSelect({ onSelect }) {
  const { layouts } = useEditComponents()
  const classes = useStyles()

  return (
    <div>
      <Typography variant="h2">Choose layout</Typography>
      <Typography variant="body1">
        Before we get started on adding some content, lets select a layout for
        our new page.
      </Typography>
      <div className={classes.layouts}>
        {Object.entries(layouts).map(([key, layout]) => {
          const Example = layout.example

          return (
            <div key={key} className={classes.layout}>
              <div className={classes.example}>
                <Example />
              </div>
              <div className={classes.name}>{layout.name}</div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onSelect(key)}
              >
                Select
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

LayoutSelect.propTypes = {
  onSelect: T.func.isRequired,
}

export default LayoutSelect