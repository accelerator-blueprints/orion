import React from 'react'
import T from 'prop-types'
import { Button, Grid } from '@material-ui/core'

const ArticleEditButtons = ({ isEditing, toggleEdit, onSave, onPublish }) => (
  <Grid container spacing={2}>
    <Grid item>
      <Button variant="contained" color="secondary" onClick={toggleEdit}>
        {isEditing ? 'Preview' : 'Edit'}
      </Button>
    </Grid>
    <Grid item>
      <Button variant="contained" color="secondary" onClick={onSave}>
        Save
      </Button>
    </Grid>
    <Grid item>
      <Button variant="contained" color="primary" onClick={onPublish}>
        Publish
      </Button>
    </Grid>
  </Grid>
)

ArticleEditButtons.propTypes = {
  isEditing: T.bool,
  toggleEdit: T.func,
  onSave: T.func,
  onPublish: T.func,
}

export default ArticleEditButtons
