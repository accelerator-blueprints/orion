import React from 'react'
import PropTypes from 'prop-types'
import {
  TableRow,
  TableCell,
  IconButton,
  withStyles,
  Checkbox,
} from '@material-ui/core'
import { PaddedContainer } from 'components'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { useMutation, useQuery } from 'graphql-hooks'

import ContentToolbar from './ContentToolbar'
import SEO from '../SEO'
import QueryTable from '../QueryTable'
import FeatureArticles from '../list/FeatureArticles'

import {
  getArticlesData,
  getEditorsPicks,
  updateArticleMutation,
} from '../../queries'

import { formatDateTime } from '../../utils/date'
import { getRandomRows } from '../../utils/array'

import get from 'lodash/get'

const headers = [
  { id: 'title', label: 'Title', sortable: true },
  { id: 'createdBy', label: 'Created By' },
  { id: 'updated_at', label: 'Last Updated', sortable: true },
  { id: 'knowledge_type', label: 'Type', sortable: true },
  {
    id: 'editorsPicks',
    label: "Editor's Picks",
    cellProps: { align: 'center' },
  },
  { id: 'view', label: 'View', cellProps: { align: 'center' } },
]

const EditorsPicks = ({ classes }) => {
  const [updateEditorsPick] = useMutation(updateArticleMutation)

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

  const {
    data: { editors_picks: editorsPicks = [] } = {},
    refetch: refetchEditorsPicks,
  } = useQuery(getEditorsPicks)

  const toggleEditorPick = async (id, editors_pick) =>
    await updateEditorsPick({
      variables: {
        id,
        changes: {
          editors_pick,
        },
      },
    })

  return (
    <PaddedContainer>
      <SEO pageTitle="Editor's Picks" />
      <ContentToolbar pageTitle="Content" />
      <FeatureArticles
        title="Editor's Picks Preview"
        articles={getRandomRows(editorsPicks, 3)}
      />
      <QueryTable
        headers={headers}
        query={getArticlesData}
        variables={{ status: 'published' }}
        orderBy={{ updated_at: 'desc' }}
        renderTableBody={(data, refetchArticles) =>
          data &&
          data.article.map(article => (
            <TableRow hover key={article.id} size="small">
              <TableCell>{article.title}</TableCell>
              <TableCell>
                {get(article, 'createdBy.first_name')}{' '}
                {get(article, 'createdBy.last_name')}
              </TableCell>
              <TableCell>{formatDateTime(article.updated_at)}</TableCell>
              <TableCell>{knowledgeTypes[article.knowledge_type]}</TableCell>
              <TableCell align="center">
                <Checkbox
                  color="default"
                  checked={article.editors_pick}
                  onChange={async (event, checked) => {
                    await toggleEditorPick(article.id, checked)
                    refetchEditorsPicks()
                    refetchArticles()
                  }}
                  disabled={!article.editors_pick && editorsPicks.length > 2}
                />
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
    </PaddedContainer>
  )
}

EditorsPicks.propTypes = {
  classes: PropTypes.object,
  setPageTitle: PropTypes.func,
}

const styles = theme => ({
  icon: {
    ...theme.iconLight,
  },
})

export default withStyles(styles)(EditorsPicks)
