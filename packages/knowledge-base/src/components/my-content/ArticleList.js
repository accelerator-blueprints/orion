import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TableRow, TableCell, IconButton, withStyles } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import { Link, useStaticQuery, graphql } from 'gatsby'

import { ArticleStatusChip } from 'components'

import QueryTable from '../QueryTable'
import { getArticlesData, getUserArticlesData } from '../../queries'

import { useUserId, useIsPlatformGroup } from '../../utils/auth'
import { formatDate } from '../../utils/date'
import get from 'lodash/get'

const headers = [
  { id: 'title', label: 'Title', sortable: true },
  { id: 'createdBy', label: 'Created By' },
  { id: 'updated_at', label: 'Last Updated', sortable: true },
  { id: 'knowledge_type', label: 'Type', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'edit', label: 'Edit', cellProps: { align: 'center' } },
  { id: 'view', label: 'View', cellProps: { align: 'center' } },
]

const ArticleList = ({ classes, setPageTitle, path }) => {
  const [statusFilter, setStatusFilter] = useState()
  useEffect(() => {
    const inReview = path === '/needs-review'
    setStatusFilter(inReview ? 'in-review' : undefined)
    setPageTitle(inReview ? 'Needs Review' : 'All Stories')
  }, [path])
  const isPlatformGroup = useIsPlatformGroup()
  const userId = useUserId()
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
  const knowledgeTypes = get(staticResult, 'allKnowledgeTypes.nodes').reduce(
    (acc, { key, name }) => {
      acc[key] = name
      return acc
    },
    {}
  )

  let query
  let variables

  if (isPlatformGroup) {
    query = getArticlesData
    variables = { status: statusFilter }
  } else {
    query = getUserArticlesData
    variables = { createdById: userId }
  }

  return (
    <QueryTable
      headers={headers}
      query={query}
      variables={variables}
      orderBy={{ updated_at: 'desc' }}
      renderTableBody={data =>
        data &&
        data.article.map(article => (
          <TableRow hover key={article.id} size="small">
            <TableCell>{article.title}</TableCell>
            <TableCell>
              {article.createdBy.first_name} {article.createdBy.last_name}
            </TableCell>
            <TableCell>{formatDate(article.updated_at)}</TableCell>
            <TableCell>{knowledgeTypes[article.knowledge_type]}</TableCell>
            <TableCell>
              <ArticleStatusChip status={article.status} />
            </TableCell>
            <TableCell align="center" padding="none">
              <IconButton
                className={classes.icon}
                component={Link}
                disabled={status !== 'in-progress' && !isPlatformGroup}
                to={`/submit/${article.id}`}
              >
                <EditIcon />
              </IconButton>
            </TableCell>
            <TableCell align="center" padding="none">
              <IconButton
                className={classes.icon}
                component={Link}
                to={`/content/${article.path}`}
              >
                <InsertDriveFileIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))
      }
    />
  )
}

ArticleList.propTypes = {
  classes: PropTypes.object,
  setPageTitle: PropTypes.func,
}

const styles = theme => ({
  icon: {
    color: theme.articleTableIconColor,
  },
})

export default withStyles(styles)(ArticleList)
