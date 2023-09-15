export const gqlGetSessions = `
query GetSessions {
  sessionsInfo {
    sessions {
      id
      capabilities
      startTime
      uri
      nodeId
      nodeUri
      sessionDurationMillis
      slot {
        id
        stereotype
        lastStarted
        __typename
      }
      __typename
    }
    sessionQueueRequests
    __typename
  }
}
`;