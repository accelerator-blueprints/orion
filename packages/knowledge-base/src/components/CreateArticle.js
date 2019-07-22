import React from 'react'
import { PaddedContainer } from 'components'
import { getUserIdSync } from '../utils/auth'
import { useMutation } from 'graphql-hooks'
import { createArticleMutation } from '../queries'
import { navigate } from '@reach/router'
import SEO from '../components/SEO'
import BoxControlLabel from '../components/BoxControlLabel'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { RadioGroup } from 'formik-material-ui'
import { withStyles, Radio, Typography } from '@material-ui/core'
import { useStaticQuery, graphql } from 'gatsby'
import get from 'lodash/get'

const CustomRadioGroup = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginLeft: 0,
    marginRight: theme.spacing(2),
    '&>label': {
      marginLeft: 0,
      marginRight: theme.spacing(1),
    },
  },
}))(RadioGroup)

function CreateArticle({ classes }) {
  const staticResult = useStaticQuery(graphql`
    {
      allKnowledgeTypes(sort: { fields: orderIndex, order: ASC }) {
        nodes {
          name
          key
        }
      }
    }
  `)
  const knowledgeTypes = get(staticResult, 'allKnowledgeTypes.nodes')
  const [createArticle] = useMutation(createArticleMutation)

  const handleSelectType = async (values, actions) => {
    const creatorId = getUserIdSync()
    //TODO: graceful error handling
    const {
      data: {
        insert_article: {
          returning: [{ id }],
        },
      },
    } = await createArticle({ variables: { ...values, creatorId } })

    actions.setSubmitting(false)
    navigate(`/my-content/edit/${id}`)
  }

  return (
    <>
      <SEO title="Create Article" />
      <PaddedContainer>
        <Formik
          validationSchema={Yup.object().shape({
            knowledgeType: Yup.string().required(),
          })}
          onSubmit={handleSelectType}
        >
          {({ handleSubmit, submitForm, submitCount, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Typography
                color="secondary"
                variant="h4"
                className={classes.fieldLabel}
              >
                Let’s start by selecting a knowledge type
              </Typography>
              <Field
                name="knowledgeType"
                label="Knowledge Type"
                component={CustomRadioGroup}
              >
                {knowledgeTypes.map(({ key, name }) => (
                  <BoxControlLabel
                    key={key}
                    disabled={isSubmitting}
                    onChange={() => setImmediate(submitForm)}
                    value={key}
                    control={<Radio />}
                    label={name}
                  />
                ))}
              </Field>
            </Form>
          )}
        </Formik>
      </PaddedContainer>
    </>
  )
}

export default withStyles(theme => ({
  fieldLabel: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}))(CreateArticle)
