module.exports = `{
  orion {
    orion_page(where: {
      _and: {
        published: { _is_null: false },
        expires: { _is_null: true }
      }
    }) {
      authors {
        user {
          title
          given_name
          avatar
        }
      }
      contents {
        block
        component
        id
        props
      }
      parent {
        id
        path
        title
      }
      tags {
        tag {
          hidden
          tag
        }
      }
      created
      id
      layout
      modified
      path
      published
      show_in_menu
      title
    }
  }
}`
