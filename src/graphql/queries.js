/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserLeaderboard = /* GraphQL */ `
  query GetUserLeaderboard($id: ID!) {
    getUserLeaderboard(id: $id) {
      id
      name
      score
      imageUrl
      type
      location
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUserLeaderboards = /* GraphQL */ `
  query ListUserLeaderboards(
    $filter: ModelUserLeaderboardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserLeaderboards(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        score
        imageUrl
        type
        location
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userByName = /* GraphQL */ `
  query UserByName(
    $name: String!
    $score: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModeluserLeaderboardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByName(
      name: $name
      score: $score
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        score
        imageUrl
        type
        location
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const usersByScore = /* GraphQL */ `
  query UsersByScore(
    $type: String!
    $score: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModeluserLeaderboardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByScore(
      type: $type
      score: $score
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        score
        imageUrl
        type
        location
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
