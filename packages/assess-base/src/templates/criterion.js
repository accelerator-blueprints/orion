import React from 'react'
import { Typography, withStyles, Grid, Button } from '@material-ui/core'
import { PaddedContainer, SectionTitle } from 'components'
import { Link } from 'gatsby'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { Field, Formik, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import { useQuery, useMutation } from 'graphql-hooks'
import get from 'lodash/get'

import SEO from '../components/SEO'
import { getAssessmentId } from '../utils/url'
import {
  getAssessmentCriterionData,
  upsertAssessmentCriterionDataMutation,
} from '../queries'
import FileList from '../components/FileList'
import { getUserIdSync, isAdminSync } from '../utils/auth'
import { assessmentInProgress } from '../utils/assessment-status'

function createFormInitialValues(assessmentCriterionData) {
  if (
    !assessmentCriterionData ||
    !assessmentCriterionData.assessment_criterion_data_by_pk
  ) {
    return {
      summary: '',
    }
  }

  return assessmentCriterionData.assessment_criterion_data_by_pk.data
}

function CriterionTemplate({
  theme,
  classes,
  pageContext: { assessment, pillar, criterion, pillarColor },
  location,
}) {
  const assessmentId = getAssessmentId(location)
  const isAdmin = isAdminSync()
  const userId = getUserIdSync()

  const { t } = useTranslation()

  const { data: assessmentCriterionData, refetch } = useQuery(
    getAssessmentCriterionData,
    {
      variables: {
        assessmentId,
        pillarKey: pillar.key,
        criterionKey: criterion.key,
      },
    }
  )

  const [upsertAssessmentData] = useMutation(
    upsertAssessmentCriterionDataMutation
  )

  async function handleFormSubmit(values, { setSubmitting, resetForm }) {
    try {
      const {
        data: {
          insert_assessment_criterion_data: { returning },
        },
      } = await upsertAssessmentData({
        variables: {
          input: {
            assessment_id: assessmentId,
            pillar_key: pillar.key,
            criterion_key: criterion.key,
            data: values,
          },
        },
      })
      resetForm(returning[0].data)
    } finally {
      setSubmitting(false)
    }
  }

  const canEditAndUpload =
    isAdmin &&
    assessmentInProgress(get(assessmentCriterionData, 'assessment_by_pk'))

  return (
    <div className={classes.root} data-testid="criterion">
      <SEO title={criterion.name} />
      <PaddedContainer className={classes.paddedContainer}>
        <Grid container spacing={2} wrap="nowrap">
          <Grid item>
            <Button
              component={Link}
              to={`assessment/${assessment.key}#${assessmentId}`}
              variant="text"
              color="secondary"
            >
              ◀ Assessment overview
            </Button>
          </Grid>
          <Grid item xs />
          <Grid item>
            <FileList
              assessmentId={assessmentId}
              userId={userId}
              pillar={pillar}
              criterion={criterion}
              files={get(assessmentCriterionData, 'assessment_file', [])}
              canUpload={canEditAndUpload}
              onUploadComplete={refetch}
            />
          </Grid>
        </Grid>
        <div className={classes.section}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <SectionTitle barColor={pillarColor}>
                {pillar.name} <span style={{ color: pillarColor }}>▶</span>{' '}
                {t(criterion.name)}
              </SectionTitle>
            </Grid>
            <Grid item xs>
              <Typography component="div">
                <ReactMarkdown
                  source={t(criterion.description)}
                  renderers={{ paragraph: 'div' }}
                />
              </Typography>
              <Button
                component={Link}
                to={`${location.pathname}/1#${assessmentId}`}
                variant="contained"
                color="secondary"
                className={classes.section}
              >
                Assess {criterion.name}
              </Button>
              <Formik
                initialValues={createFormInitialValues(assessmentCriterionData)}
                enableReinitialize
                onSubmit={handleFormSubmit}
              >
                {({ isSubmitting, dirty }) => (
                  <Form>
                    <Grid
                      container
                      direction="column"
                      spacing={2}
                      className={classes.section}
                    >
                      <Grid item xs={6}>
                        <Typography variant="h4" gutterBottom>
                          {criterion.name} summary
                        </Typography>
                        <Field
                          component={TextField}
                          disabled={!canEditAndUpload}
                          name="summary"
                          multiline
                          rows={4}
                          fullWidth
                        />
                      </Grid>
                      {canEditAndUpload && (
                        <Grid item>
                          <Button
                            variant="outlined"
                            color="secondary"
                            type="submit"
                            disabled={!dirty || isSubmitting}
                          >
                            Save Updates
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </div>
      </PaddedContainer>
    </div>
  )
}

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  paddedContainer: {
    flex: 1,
  },
  section: {
    marginTop: theme.spacing(3),
  },
})

export default withStyles(styles, { withTheme: true })(CriterionTemplate)