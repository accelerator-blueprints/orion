import React from 'react'
import { ThemeProvider } from 'styled-components/macro'
import { theme } from 'saluki'

import { storiesOf } from '@storybook/react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs/react'
import { wInfo } from '../../../../../.storybook/utils'

import Button from '.'

storiesOf('System/Components/Button', module)
  .addDecorator(jsxDecorator)
  .addDecorator(
    wInfo(`
      ### Notes
      This is the most basic button component:

      ### To use this Storybook
      Explore the panels on the left.
    `)
  )
  .addDecorator(story => <ThemeProvider theme={theme}>{story()}</ThemeProvider>)
  .add('Basic Button Example', () => (
    <Button
      onClick={action('clicked')}
      label={text('label', 'Hello World Button')}
    />
  ))