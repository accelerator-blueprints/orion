import React from 'react'
import T from 'prop-types'
import { Typography, withStyles, Grid, Button } from '@material-ui/core'

import { SectionTitleField, InputField } from './FormFields'

function Register({
  theme,
  classes,
  signUp,
  goToSignIn,
  handleInput,
  signUpFields,
}) {
  return (
    <div className={classes.root}>
      <div>
        <Grid container spacing={3} className={classes.form}>
          <Grid item xs={8}>
            <SectionTitleField
              barColor={theme.palette.secondary.main}
              category="general"
            >
              Create a new account
            </SectionTitleField>
          </Grid>
          {signUpFields.map(params => {
            return (
              <Grid key={params.key} item xs={params.xs}>
                <InputField
                  name={params.key}
                  type={params.type}
                  required={params.required}
                  options={params.options}
                  onChange={handleInput}
                  fullWidth
                >
                  {params.label}
                </InputField>
              </Grid>
            )
          })}
          <Grid
            item
            container
            alignItems="baseline"
            xs={9}
            spacing={1}
            wrap="nowrap"
          >
            <Grid item>
              <Typography variant="h4" color="textSecondary" noWrap>
                Have an account?
              </Typography>
            </Grid>
            <Grid item>
              <Button color="secondary" onClick={goToSignIn} size="small">
                Sign In
              </Button>
            </Grid>
            <Grid item xs={2}>
              &nbsp;
            </Grid>
            <Grid item>
              <Button
                name="submit"
                color="secondary"
                variant="contained"
                fullWidth
                onClick={signUp}
              >
                Create Account
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

Register.propTypes = {
  theme: T.object.isRequired,
  classes: T.object.isRequired,
  signUp: T.func.isRequired,
  goToSignIn: T.func.isRequired,
  handleInput: T.func.isRequired,
  signUpFields: T.array.isRequired,
}

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  form: {
    margin: 'auto',
    maxWidth: 510,
  },
}

export default withStyles(styles, { withTheme: true })(Register)
