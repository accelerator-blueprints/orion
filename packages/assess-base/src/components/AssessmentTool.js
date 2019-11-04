import React from 'react'
import T from 'prop-types'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  withStyles,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const buttonText = text => {
  const words = []

  text.split` `.forEach(word => {
    if (!words.length) {
      words.push(word)
    } else {
      const phrase = `${words[words.length - 1]} ${word}`
      // 30 is used to keep 'Enter Business Matrix Advanced' on one line
      if (phrase.length <= 30) {
        words[words.length - 1] = phrase
      } else {
        words.push(word)
      }
    }
  })

  return (
    <div>
      {words.map((word, i) => (
        <div key={i}>{word}</div>
      ))}
    </div>
  )
}

const AssessmentTool = ({
  theme,
  classes,
  assessmentToolMeta,
  barColor,
  isAuthenticated,
}) => {
  const { t } = useTranslation()
  return (
    <Grid item xs data-testid="assessment-tool">
      <Card className={classes.card} style={{ borderTopColor: barColor }}>
        <CardContent className={classes.cardContent}>
          <Typography variant="h3" className={classes.cardElement}>
            {t(assessmentToolMeta.name)}
          </Typography>
          <Img
            fixed={assessmentToolMeta.logo.childImageSharp.fixed}
            className={classes.cardElement}
          />
          <Typography className={classes.cardElement}>
            {t(assessmentToolMeta.shortDescription)}
          </Typography>
        </CardContent>
        {isAuthenticated && (
          <CardActions className={classes.bottom}>
            <Button
              component={Link}
              to={`/assessment/${assessmentToolMeta.key}`}
              color="secondary"
              fullWidth
            >
              {buttonText(assessmentToolMeta.startPhrase)}
            </Button>
          </CardActions>
        )}
      </Card>
    </Grid>
  )
}

const styles = theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderTopWidth: theme.spacing(1),
    borderTopStyle: 'solid',
  },
  cardContent: {
    paddingTop: theme.spacing(1),
    flex: 1,
  },
  cardElement: {
    marginBottom: theme.spacing(2),
  },
  bottom: {
    borderTop: `solid 1px ${theme.palette.background.light}`,
  },
})

AssessmentTool.propTypes = {
  assessmentToolMeta: T.shape({
    name: T.string.isRequired,
    shortDescription: T.string.isRequired,
    logo: T.object.isRequired,
  }).isRequired,
  barColor: T.string.isRequired,
  isAuthenticated: T.bool.isRequired,
}

export default withStyles(styles, { withTheme: true })(AssessmentTool)
