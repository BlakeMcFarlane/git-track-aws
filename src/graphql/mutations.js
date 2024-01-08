/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUserLeaderboard = /* GraphQL */ `
  mutation CreateUserLeaderboard(
    $input: CreateUserLeaderboardInput!
    $condition: ModelUserLeaderboardConditionInput
  ) {
    createUserLeaderboard(input: $input, condition: $condition) {
      id
      name
      score
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUserLeaderboard = /* GraphQL */ `
  mutation UpdateUserLeaderboard(
    $input: UpdateUserLeaderboardInput!
    $condition: ModelUserLeaderboardConditionInput
  ) {
    updateUserLeaderboard(input: $input, condition: $condition) {
      id
      name
      score
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUserLeaderboard = /* GraphQL */ `
  mutation DeleteUserLeaderboard(
    $input: DeleteUserLeaderboardInput!
    $condition: ModelUserLeaderboardConditionInput
  ) {
    deleteUserLeaderboard(input: $input, condition: $condition) {
      id
      name
      score
      createdAt
      updatedAt
      __typename
    }
  }
`;
