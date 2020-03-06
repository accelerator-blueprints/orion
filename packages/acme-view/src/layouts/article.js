import React from 'react'
import T from 'prop-types'
import PaddedContainer from 'gatsby-plugin-orion-core/src/components/PaddedContainer'
import { Grid } from '@material-ui/core'

function ArticleLayout({ content, metadata }) {
  return (
    <PaddedContainer>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          {metadata}
        </Grid>
        <Grid item xs={7}>
          {content}
        </Grid>
      </Grid>
    </PaddedContainer>
  )
}

ArticleLayout.propTypes = {
  content: T.node.isRequired,
  metadata: T.node.isRequired,
}

export default ArticleLayout
