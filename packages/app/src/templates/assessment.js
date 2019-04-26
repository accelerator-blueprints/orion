import React from 'react'
import {
  Typography,
  withStyles,
  Grid,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TextField,
  Button,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { AssessmentProgress, PaddedContainer } from 'components'
import { Link } from 'gatsby'
import slugify from 'slugify'

import SEO from '../components/seo'
import ImagePlaceholder from '../components/ImagePlaceholder'
import SectionTitle from '../components/SectionTitle'

function Assess({
  theme,
  classes,
  pageContext: { assessment, slug, pillarColors },
}) {
  const { t } = useTranslation()

  return (
    <>
      <SEO title={t('Your assessments')} />
      <PaddedContainer>
        <Typography variant="h1" gutterBottom>
          {t('Your assessments')}
        </Typography>
        <div className={classes.section}>
          <Typography variant="h3" gutterBottom>
            Assessments completed
          </Typography>
          <Grid container spacing={theme.spacing.unit * 4}>
            <Grid item xs={7}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={5}>
              <ImagePlaceholder>
                <Typography variant="h4">Pic of Model 2020</Typography>
              </ImagePlaceholder>
            </Grid>
          </Grid>
        </div>
        <div className={classes.section}>
          <Grid container spacing={theme.spacing.unit * 4}>
            <Grid item xs={3}>
              <SectionTitle barColor={theme.palette.primary.dark}>
                Your organisation
              </SectionTitle>
            </Grid>
          </Grid>
        </div>
        <div className={classes.section}>
          <Grid container spacing={theme.spacing.unit * 4}>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Enter your assessment unit
              </Typography>
              <TextField fullWidth />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Add key information
              </Typography>
              <Typography>
                Key Information is those key facts about your organisation which
                help assessors to gain an overall view of your organisation and
                its strategic context.
              </Typography>
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                multiline
                rows={5}
                className={classes.keyInformationInput}
              />
              <Button color="secondary" variant="outlined">
                upload key information
              </Button>
            </Grid>
          </Grid>
        </div>
        <div className={classes.section}>
          <Grid container spacing={theme.spacing.unit * 3}>
            <Grid item>
              <Typography variant="h4" gutterBottom>
                to enter the assessment please click on an area of the model
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={theme.spacing.unit * 2}>
            <Grid item xs={3}>
              <SectionTitle barColor={theme.palette.primary.dark}>
                {assessment.name}
              </SectionTitle>
            </Grid>
            {assessment.pillars.map((pillar, pillarIndex) => {
              const pillarSlug = slugify(pillar.name)
              const pillarColor = pillarColors[pillarIndex]
              return (
                <Grid
                  key={pillar.name}
                  item
                  xs
                  container
                  spacing={theme.spacing.unit * 3}
                  direction="column"
                >
                  <Grid item>
                    <SectionTitle barColor={pillarColor}>
                      {pillar.name}
                    </SectionTitle>
                  </Grid>
                  {pillar.criteria.map(criterion => (
                    <Grid item key={criterion.name}>
                      <Typography
                        component={Link}
                        to={`assessment/${slug}/${pillarSlug}/${slugify(
                          criterion.name
                        )}`}
                        variant="h3"
                        gutterBottom
                        style={{ color: pillarColor }}
                      >
                        {criterion.name}
                      </Typography>
                      <Typography
                        variant="h4"
                        className={classes.sectionProgress}
                      >
                        0% complete
                      </Typography>
                    </Grid>
                  ))}{' '}
                </Grid>
              )
            })}
          </Grid>
        </div>
        <div className={classes.section}>
          <Grid container spacing={theme.spacing.unit * 2}>
            <Grid item xs={3}>
              <SectionTitle gutterBottom barColor={theme.palette.primary.dark}>
                lens view
              </SectionTitle>
              <Typography>
                If you would like to lead your assessment through one of the
                following lenses you can follow these paths.
              </Typography>
            </Grid>
            <Grid item xs>
              <Button fullWidth color="secondary" variant="outlined">
                innovation
              </Button>
            </Grid>
            <Grid item xs>
              <Button fullWidth color="secondary" variant="outlined">
                circular economy
              </Button>
            </Grid>
            <Grid item xs>
              <Button fullWidth color="secondary" variant="outlined">
                lens 3
              </Button>
            </Grid>
            <Grid item xs>
              <Button fullWidth color="secondary" variant="outlined">
                lens 4
              </Button>
            </Grid>
          </Grid>
        </div>
      </PaddedContainer>
      <AssessmentProgress />
    </>
  )
}

const styles = theme => ({
  section: {
    margin: `${theme.spacing.unit * 3}px 0`,
  },
  keyInformationInput: {
    marginBottom: theme.spacing.unit * 2,
  },
  sectionProgress: {
    color: theme.palette.primary.dark,
  },
})

export default withStyles(styles, { withTheme: true })(Assess)
