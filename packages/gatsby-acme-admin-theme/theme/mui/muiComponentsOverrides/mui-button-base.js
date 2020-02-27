const theme = require('@material-ui/core/styles/defaultTheme').default
const { fade } = require('@material-ui/core/styles/colorManipulator')

console.log('THEME:', theme)

module.exports = {
  root: {
    '&.upload-image-base': {
      position: 'relative',
      height: 0,
      paddingTop: '50%',
      width: '100%',
      color: 'transparent',
      '&:hover, &$focusVisible, &.alwaysShowBox': {
        zIndex: 1,
        color: theme.palette.common.white,
        '& $imageBackdrop': {
          opacity: 0.4,
        },
        '& $imageTitle': {
          opacity: 1,
        },
      },
    },
    '&.upload-image-src': {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundColor: fade(theme.palette.common.black, 0.5),
    },
    '&.upload-image-backdrop': {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.black,
      opacity: 0,
      transition: theme.transitions.create('opacity'),
    },
    '&.upload-image-button': {
      Position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& .upload-image-typography': {
        // TODO: pickup the article typography from???
        // ...theme.articleTypography.articleEditButton,
        padding: theme.spacing(1, 3),
        borderRadius: theme.spacing(0.5),
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        opacity: 0,
        transition: theme.transitions.create('opacity'),
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(1),
          marginLeft: theme.spacing(-1),
        },
      },
    },
    '&.upload-image-progress': {
      position: 'absolute',
      left: 'calc(50% - 30px)',
      height: '60px !important',
      width: '60px !important',
    },
  },
}
