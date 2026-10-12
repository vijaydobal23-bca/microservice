const waitingRequests = [];
const availableRides = [];

export const deliverNewRide = (ride) => {
  while (waitingRequests.length > 0) {
    const waiter = waitingRequests.shift();

    if (waiter.signal?.aborted) {
      continue;
    }

    waiter.resolve(ride);
    return;
  }

  availableRides.push(ride);
};

export const waitForNewRide = (timeoutMs = 25_000, signal) => {
  if (availableRides.length > 0) {
    return Promise.resolve(availableRides.shift());
  }

  if (signal?.aborted) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const waiter = { resolve, signal };
    const finish = (ride) => {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
      const index = waitingRequests.indexOf(waiter);

      if (index !== -1) {
        waitingRequests.splice(index, 1);
      }

      resolve(ride);
    };
    const abort = () => finish(null);
    const timeout = setTimeout(() => finish(null), timeoutMs);

    waiter.resolve = finish;
    waitingRequests.push(waiter);
    signal?.addEventListener("abort", abort, { once: true });
  });
};
