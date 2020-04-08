import React from 'react'
import PropTypes from 'prop-types'
import { Link, navigate } from '@reach/router'
import {
  Button,
  AppBar as MuiAppBar,
  Toolbar,
  makeStyles,
} from '@material-ui/core'
import HorizontalNavigationMenu from 'gatsby-plugin-orion-core/src/components/HorizontalNavigationMenu'
import LanguageSelector from './LanguageSelector'
import PaddedContainer from 'gatsby-plugin-orion-core/src/components/PaddedContainer'
import AuthButton from './AuthButton'

import { Auth } from 'gatsby-plugin-orion-core/src/utils/amplify'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    '& .MuiButton-root': {
      textTransform: 'none',
      boxShadow: 'none',
      '& .MuiButton-label': {
        color: theme.palette.background.default,
        textTransform: 'capitalize',
      },
      '& .MuiIcon-root': {
        marginLeft: 8,
      },
    },
  },
  logo: {
    height: 40,
    width: 90,
    marginLeft: -8,
    padding: 0,
    '& img': {
      width: '100%',
    },
  },
  container: {
    alignItems: 'center',
    display: 'flex',
  },
  menu: {
    alignItems: 'center',
    display: 'flex',
    margin: theme.spacing(0, 1),
  },
  toolbar: {
    justifyContent: 'space-between',
    padding: 0,
  },
}))

const LinkEdit = ({ userRole }) => {
  if ((userRole === 'User' || userRole === 'Admin') && Auth.user !== null) {
    let slug = process.env.GATSBY_EDIT_URL || undefined

    if (slug === undefined) {
      const a = window.location.hostname.toLowerCase().split('.')

      switch (a[0]) {
        case 'view':
          slug = `edit.${a[1]}.${a[2]}`
          break
        case 'localhost':
          slug = 'http://localhost:8001'
          break
        default:
          console.error('edit redirect not configured in Environment vars')
      }
    }

    return <Button onClick={() => navigate(slug)}>Edit</Button>
  }

  return null
}

const AppBar = ({
  menuData,
  dropDownIndicatorIcon,
  childIndicatorIcon,
  userRole,
  Logo,
  brandTo,
}) => {
  const classes = useStyles()

  return (
    <MuiAppBar position="static" className={classes.root}>
      <PaddedContainer>
        <Toolbar className={classes.toolbar}>
          {Logo && (
            <Button
              edge="start"
              component={Link}
              color="inherit"
              aria-label="menu"
              to={brandTo ? brandTo : '#'}
              className={classes.logo}
              data-testid="brand-logo-button"
            >
              <Logo width="107" />
            </Button>
          )}
          <div className={classes.container}>
            <div className={classes.menu}>
              {menuData && (
                <HorizontalNavigationMenu
                  data={menuData}
                  dropDownIndicatorIcon={dropDownIndicatorIcon}
                  childIndicatorIcon={childIndicatorIcon}
                  userRole={userRole}
                />
              )}
              <LinkEdit userRole={userRole} />
              <AuthButton />
            </div>

            <LanguageSelector />
          </div>
        </Toolbar>
      </PaddedContainer>
    </MuiAppBar>
  )
}

AppBar.propTypes = {
  menuData: PropTypes.array,
  dropDownIndicatorIcon: PropTypes.string,
  childIndicatorIcon: PropTypes.string,
  userRole: PropTypes.string,
  brandTo: PropTypes.string,
  Logo: PropTypes.elementType,
}

AppBar.defaultProps = {
  menuData: undefined,
  dropDownIndicatorIcon: 'fas fa-chevron-down',
  childIndicatorIcon: 'fas fa-chevron-right',
  userRole: undefined,
  brandTo: undefined,
  Logo: undefined,
}

export default AppBar
