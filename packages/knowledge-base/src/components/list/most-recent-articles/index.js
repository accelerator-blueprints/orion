import React, { useEffect } from 'react'
import { Box, makeStyles } from '@material-ui/core'
import { getArticlesData } from '../../../queries'
import { useManualQuery } from 'graphql-hooks'
import ArticleSummary from '../../content/ArticleSummary'
import column from '../../layout/flex-with-gap/column'
import ListTitle from '../ListTitle'

const useMostRecentArticlesStyles = makeStyles(theme => ({
  wrapper: {
    ...column(theme)(0),
    marginBottom: 0,
    marginTop: 0,
    padding: 0,
  },
}))

const MostRecentArticles = () => {
  const [
    fetchMostRecentArticles,
    { data: mostRecentArticles },
  ] = useManualQuery(getArticlesData, {
    variables: {
      limit: 2,
      offset: 0,
      orderBy: { created_at: 'desc' },
    },
  })

  useEffect(() => {
    fetchMostRecentArticles()
  }, [fetchMostRecentArticles])

  const { wrapper } = useMostRecentArticlesStyles()

  if (!mostRecentArticles) {
    return null
  }

  return (
    <Box className={wrapper} component="ul" data-test-id="most-recent-articles">
      <ListTitle paletteColor={['grey', '800']} title="Most recent articless" />
      {mostRecentArticles.article.map(article => (
        <ArticleSummary article={article} key={`article-${article.id}`} />
      ))}
    </Box>
  )
}

export default MostRecentArticles
