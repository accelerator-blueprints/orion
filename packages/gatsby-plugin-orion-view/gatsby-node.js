const getPagesQuery = require('./queries/get-pages')
const getMenuQuery = require('./queries/get-menu-items')
const pageComponent = require.resolve('./src/components/Page')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const menuResults = await graphql(getMenuQuery)
  const pagesResults = await graphql(getPagesQuery)

  if (pagesResults.errors) {
    throw pagesResults.errors
  }

  createPage({
    path: '/_not_found',
    matchPath: '/*',
    component: pageComponent || '',
    context: {
      page: null,
    },
  })

  const menu = menuResults.data.orion.orion_page.map(item => {
    return {
      label: item.title,
      to: item.path,
      children: item.descendants.map(({ descendant }) => {
        return {
          label: descendant.title,
          to: descendant.path,
        }
      }),
    }
  })

  pagesResults.data.orion.orion_page.forEach(page => {
    const pathSyntax = page.path[page.path.length - 1] === '/' ? '*' : '/*'
    const suffix = page.path === '/' ? '' : pathSyntax

    createPage({
      path: page.path,
      matchPath: `${page.path}${suffix}`,
      component: pageComponent,
      context: {
        page,
        menu,
      },
    })
  })

  return null
}
