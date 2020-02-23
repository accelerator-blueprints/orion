import React from 'react'
import T from 'prop-types'
import { Grid, Button } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'

import { InputField } from '../FormFields'

function MyForm({ formFields = [], title, SubmitComponent, onSubmit }) {
  const values = formFields.reduce((a, field) => {
    a[field.name] = ''
    return a
  }, {})

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={12}>
        {title}
      </Grid>
      <Grid item xs={12}>
        <Formik initialValues={values} onSubmit={onSubmit}>
          {props => {
            const {
              values,
              errors,
              touched,
              handleChange,
              isValid,
              setFieldTouched,
              handleSubmit,
            } = props

            const change = name => e => {
              e.persist()
              handleChange(e)
              setFieldTouched(name, true, false)
            }

            return (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} justify="center">
                  {formFields.map(
                    ({
                      name,
                      xs,
                      validate,
                      label,
                      inputTypographyVariant,
                      ...formField
                    }) => (
                      <Grid key={name} item xs={xs || 12}>
                        <Field
                          value={values[name]}
                          name={name}
                          validate={validate ? e => validate(e, values) : null}
                          onChange={change(name)}
                        >
                          {({ field }) => (
                            <InputField
                              fullWidth
                              helperText={label}
                              error={touched[name] && errors[name]}
                              inputTypographyVariant={inputTypographyVariant}
                              {...field}
                              {...formField}
                            />
                          )}
                        </Field>
                      </Grid>
                    )
                  )}
                  {SubmitComponent ? (
                    <SubmitComponent disabled={!isValid} />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!isValid}
                    >
                      Submit
                    </Button>
                  )}
                </Grid>
              </form>
            )
          }}
        </Formik>
      </Grid>
    </Grid>
  )
}

Form.propTypes = {
  formFields: T.arrayOf(T.object), // Make a validator that each name/key should be unique
  submitButtonText: T.string,
  onSubmit: T.func.isRequired,
  title: T.object,
  SubmitText: T.object,
}

export default MyForm
