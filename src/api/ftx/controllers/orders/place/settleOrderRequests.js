async function settleOrderRequests(requests) {
  const responses = await Promise.allSettled(requests);

  for (const response of responses) {
    if (response.status === 'rejected') {
      throw response.reason;
    }
  }
}

export { settleOrderRequests };
