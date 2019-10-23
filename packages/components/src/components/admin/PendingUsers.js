import React from 'react'
import T from 'prop-types'
import { useQuery, useMutation } from 'graphql-hooks'
import {
  withStyles,
  TableRow,
  TableCell,
  Tooltip,
  Typography,
  IconButton,
} from '@material-ui/core'
import { HowToReg } from '@material-ui/icons'
import * as Yup from 'yup'

import useAdminTable from '../../hooks/useAdminTable'
import AdminModal from './AdminModal'
import UserSelectPicker from './UserSelectPicker'

import {
  getPendingUsers,
  getEdittableUserFields,
  addUserGroupMutation,
  assignUserGroupMutation,
  addUserRoleMutation,
} from '../../../queries'

const styles = theme => ({
  middle: {
    verticalAlign: 'middle',
  },
  actionButton: {
    marginRight: theme.spacing(4),
  },
})

const headers = [
  { id: 'id', label: 'ID', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'orgName', label: 'Org name' },
  { id: 'orgType', label: 'Org type' },
  { id: 'country', label: 'Country' },
  {
    id: 'action',
    label: 'Assign to group',
    cellProps: {
      align: 'right',
    },
  },
]

function getStyledSignupAttr(user, key) {
  if (!user.signupRequest.userAttributes[key])
    return (
      <Typography variant="body2" color="textSecondary">
        None
      </Typography>
    )

  return (
    <Typography variant="body2">
      {user.signupRequest.userAttributes[key]}
    </Typography>
  )
}

function PendingUsers({ classes }) {
  const { selected, setSelected, refetch, table } = useAdminTable({
    query: getPendingUsers,
    headers,
    renderTableBody: (data, { setSelected }) =>
      data.user.map(user => (
        <TableRow key={user.id} data-testid="pending-users" size="small">
          <TableCell>
            <Typography variant="body2">{user.id}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{user.email}</Typography>
          </TableCell>
          <TableCell>{getStyledSignupAttr(user, 'custom:orgName')}</TableCell>
          <TableCell>{getStyledSignupAttr(user, 'custom:orgType')}</TableCell>
          <TableCell>{getStyledSignupAttr(user, 'custom:country')}</TableCell>
          <TableCell align="right" padding="none">
            <Tooltip title={`Assign group to ${user.email}`} aria-label="Add">
              <IconButton
                onClick={() => setSelected(user)}
                className={classes.actionButton}
              >
                <HowToReg color="secondary" />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      )),
  })

  const { data: modalData } = useQuery(getEdittableUserFields)

  const [doAddUserGroup] = useMutation(addUserGroupMutation)
  const [doAssignUserGroup] = useMutation(assignUserGroupMutation)
  const [doAddUserRole] = useMutation(addUserRoleMutation)

  const modalContents = [
    {
      label: 'Group',
      FieldComponent: UserSelectPicker,
      entityKey: 'group',
    },
  ]

  const modalSchema = Yup.object().shape({
    userId: Yup.number().integer(),
    groupId: Yup.number().integer(),
    groupIsAssigned: Yup.boolean(),
  })

  async function onModalSave(values, user) {
    const setupUserGroup = () => {
      const { groupIsAssigned, userId, groupId } = values
      const args = { variables: { userId, groupId } }
      return groupIsAssigned ? doAssignUserGroup(args) : doAddUserGroup(args)
    }

    const setupUserRole = () => {
      if (!user.user_roles.length) {
        const memberRole = modalData.role.find(
          ({ name }) => name.toLowerCase() === 'member'
        )

        if (memberRole) {
          return doAddUserRole({
            variables: {
              userId: values.userId,
              roleId: memberRole.id,
            },
          })
        }
        // No stable ref to "member" role on db. Warn if someone changed role's name or didn't create one
        // eslint-disable-next-line no-console
        console.warn(
          `No "member" role found. Approved user ${values.userId} will have no role`
        )
      }
      return Promise.resolve()
    }

    await Promise.all([setupUserGroup(), setupUserRole()])

    setSelected(null)

    refetch()
  }

  const getModalInitialValues = user => {
    const { id: userId = 0, user_groups } = user
    const groupId = user_groups.length && user_groups[0].group.id
    return {
      userId,
      groupId,
      groupIsAssigned: !!groupId,
    }
  }

  return (
    <>
      <AdminModal
        selected={selected}
        data={modalData}
        contents={modalContents}
        getTitleParts={user => ['Assign group to', user.email]}
        onSave={onModalSave}
        onClose={() => setSelected(null)}
        schema={modalSchema}
        getInitialValues={getModalInitialValues}
      />
      {table}
    </>
  )
}
PendingUsers.propTypes = {
  classes: T.object.isRequired,
}

export default withStyles(styles)(PendingUsers)