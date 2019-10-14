import React, { useContext, useState } from 'react'
import T from 'prop-types'
import {
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core'

import SectionTitle from '../page/SectionTitle'
import { AuthFormStateContext } from './AuthEventMixin'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  submitWrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: theme.palette.primary.dark,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  errorMessage: {
    textTransform: 'none',
    marginTop: '0.5em',
  },
  fieldOK: {
    border: 'none',
  },
  fieldError: {
    border: `1.5pt solid ${theme.palette.error.main}`,
  },
}))

function FieldLabel({ required, hasError, children }) {
  return (
    <Typography
      variant="h4"
      gutterBottom
      color={hasError ? 'error' : 'initial'}
    >
      {children}
      {required && ' *'}
    </Typography>
  )
}

FieldLabel.propTypes = {
  required: T.bool,
  hasError: T.bool,
  children: T.node.isRequired,
}

function ErrorMessage({ children }) {
  const classes = useStyles()
  return (
    <Typography
      variant="h4"
      gutterBottom
      color="error"
      className={classes.errorMessage}
    >
      {children}
    </Typography>
  )
}

ErrorMessage.propTypes = {
  children: T.node.isRequired,
}

function SectionTitleField({ barColor, category, children }) {
  const { errors } = useContext(AuthFormStateContext)
  const error = errors[category]
  return (
    <React.Fragment>
      <SectionTitle gutterBottom barColor={barColor}>
        {children}
      </SectionTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </React.Fragment>
  )
}

SectionTitleField.propTypes = {
  barColor: T.string,
  category: T.string,
  children: T.node.isRequired,
}

function InputTextField({
  name,
  type,
  value,
  required,
  disabled,
  onChange,
  children,
}) {
  const classes = useStyles()
  const { submitting, errors } = useContext(AuthFormStateContext)
  const error = errors[name]
  return (
    <React.Fragment>
      <FieldLabel required={required} hasError={!!error}>
        {children}
      </FieldLabel>
      <TextField
        name={name}
        type={type}
        value={value}
        required={required}
        disabled={disabled || submitting}
        onChange={onChange}
        fullWidth
        className={error ? classes.fieldError : classes.fieldOK}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </React.Fragment>
  )
}

InputTextField.propTypes = {
  name: T.string.isRequired,
  type: T.string,
  value: T.string,
  required: T.bool,
  disabled: T.bool,
  onChange: T.func,
  children: T.node.isRequired,
}

function InputSelectField({
  name,
  required,
  options = [],
  onChange,
  value = '',
  children,
  ...props
}) {
  const classes = useStyles()
  const [selectValue, setValue] = useState(value)
  const handleChange = evt => {
    setValue(evt.target.value)
    if (onChange) {
      onChange(evt)
    }
  }
  const { submitting, errors } = useContext(AuthFormStateContext)
  const error = errors[name]
  return (
    <React.Fragment>
      <FieldLabel required={required} hasError={!!error}>
        {children}
      </FieldLabel>
      <Select
        name={name}
        disabled={submitting}
        onChange={handleChange}
        value={selectValue}
        className={error ? classes.fieldError : classes.fieldOK}
        {...props}
      >
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </MenuItem>
        ))}
      </Select>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </React.Fragment>
  )
}

InputSelectField.propTypes = {
  name: T.string.isRequired,
  options: T.array,
  value: T.string,
  required: T.bool,
  onChange: T.func,
  children: T.node.isRequired,
}

function InputField({ type, children, ...props }) {
  if (type === 'select') {
    return <InputSelectField {...props}>{children}</InputSelectField>
  }
  return (
    <InputTextField type={type} {...props}>
      {children}
    </InputTextField>
  )
}

InputField.propTypes = {
  type: T.string,
  children: T.node.isRequired,
}

function SubmitButton({ onClick, children }) {
  const classes = useStyles()
  const { submitting } = useContext(AuthFormStateContext)
  return (
    <div className={classes.submitWrapper}>
      <Button
        name="submit"
        color="secondary"
        variant="contained"
        fullWidth
        onClick={onClick}
      >
        {children}
      </Button>
      {submitting && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  )
}

SubmitButton.propTypes = {
  onClick: T.func.isRequired,
  children: T.node.isRequired,
}

export { SectionTitleField, InputField, SubmitButton }