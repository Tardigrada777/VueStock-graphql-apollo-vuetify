import { gql } from "apollo-boost";

/* Posts queries */
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
    }
  }
`;

/* User queries */

/* Posts Mutations */

/* Users Mutations */
