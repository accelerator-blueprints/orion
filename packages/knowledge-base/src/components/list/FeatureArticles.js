import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, Grid } from '@material-ui/core'
import ArticlePreview from './ArticlePreview'
import ListTitle from './ListTitle'

const FeatureArticles = ({
  classes,
  title = '',
  articles = [],
  hideEmpty,
  align = 'flex-end',
}) => {
  if (hideEmpty && !articles.length) return null
  return (
    <Grid container spacing={2} justify={align} className={classes.root}>
      <Grid item xs={12} md={3} lg={2}>
        <ListTitle title={title} />
      </Grid>
      {articles.map(article => (
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          className={classes.clip}
          key={article.id}
        >
          <ArticlePreview article={article} />
        </Grid>
      ))}
    </Grid>
  )
}

FeatureArticles.propTypes = {
  title: PropTypes.string,
  articles: PropTypes.array,
  classes: PropTypes.object,
}

const styles = theme => ({
  root: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('lg')]: {
      // Align edge of boxes with article text
      marginLeft: theme.spacing(-3),
    },
  },
  clip: {
    overflowX: 'hidden',
  },
  title: {
    borderTopWidth: '8px',
    borderTopColor: theme.palette.primary.light,
    borderTopStyle: 'solid',
    paddingTop: theme.spacing(0.5),
  },
})

export default withStyles(styles)(FeatureArticles)