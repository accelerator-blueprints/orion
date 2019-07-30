import React from 'react'
import { useStaticQuery, graphql, navigate, Link } from 'gatsby'
import Img from 'gatsby-image'
import { Typography, Button, withStyles } from '@material-ui/core'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'
import classnames from 'classnames'
import { Auth } from 'aws-amplify'
import { PaddedContainer } from 'components'

import { useIsAdmin, useIsAuthenticated } from '../utils/auth'
import NavLink from './NavLink'
import SecondaryNavigation from './SecondaryNavigation'
// TODO: dedupe this from AssessBase

function MainToolbar({ classes, dark }) {
  const {
    site: {
      siteMetadata: { title },
    },
    logo: {
      childImageSharp: { fixed },
    },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
      logo: file(name: { eq: "logo" }) {
        childImageSharp {
          fixed(height: 30) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  const doLogout = () => {
    Auth.signOut()
    navigate('/auth')
  }

  const isAdmin = useIsAdmin()
  const isAuthenticated = useIsAuthenticated()

  const darkClass = classnames({
    [classes.toolbarDark]: dark,
    [classes.toolbarContrast]: dark,
    [classes.toolbarLightContrast]: !dark,
  })

  const navButtonClass = classnames(classes.navButton, darkClass)

  // darkClass is needed on both outer container and inner padded container
  // to avoid hairline gap between toolbar and main element in mobile WebKit
  return (
    <div className={darkClass} data-testid="main-toolbar">
      <div className={classes.gradient} />
      <PaddedContainer className={darkClass}>
        <div className={classes.root}>
          <Link
            to="/"
            className={classnames(classes.logoHomeLink, darkClass)}
            data-testid="main-toolbar__logo"
          >
            <Img className={classes.logo} fixed={fixed} />
            <Typography variant="h2" className={classes.logotype}>
              {title}
            </Typography>
          </Link>
          <div className={classes.grow} />
          <div
            className={classes.linksContainer}
            data-testid="main-toolbar__links-container"
          >
            <Button
              partial={false}
              className={navButtonClass}
              component={NavLink}
              to="/"
            >
              KNOWLEDGE BASE
            </Button>
            <Button
              className={navButtonClass}
              component={NavLink}
              to="https://www.efqm.org/"
            >
              EFQM.ORG
            </Button>
            {isAuthenticated && (
              <Button className={navButtonClass} component={NavLink} to="#">
                <AccountCircleOutlinedIcon
                  className={classes.icon}
                  fontSize="large"
                />
                MyEFQM
              </Button>
            )}
            {!isAuthenticated && (
              <Button className={navButtonClass} component={NavLink} to="/auth">
                LOGIN
              </Button>
            )}
            {isAdmin && (
              <Button
                className={navButtonClass}
                component={NavLink}
                to="/admin"
              >
                ADMIN
              </Button>
            )}
            {isAuthenticated && (
              <Button className={navButtonClass} onClick={doLogout}>
                LOGOUT
              </Button>
            )}
          </div>
        </div>
        <SecondaryNavigation dark={dark} />
      </PaddedContainer>
    </div>
  )
}

const styles = theme => ({
  gradient: {
    height: 8,
    backgroundImage: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main} 32%, ${theme.palette.primary.light} 56%, ${theme.palette.secondary.main} 80%, ${theme.palette.secondary.dark})`,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  logoHomeLink: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  logotype: {
    fontWeight: 900,
  },
  toolbarDark: {
    backgroundColor: theme.palette.primary.main,
  },
  toolbarLightContrast: {
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(2),
  },
  toolbarContrast: {
    color: theme.palette.background.paper,
  },
  grow: {
    flexGrow: 1,
  },
  navButton: {
    fontWeight: 'normal',
    textTransform: 'none',
  },
  icon: {
    marginRight: theme.spacing(1),
    color: 'inherit',
  },
  linksContainer: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
})

export default withStyles(styles)(MainToolbar)