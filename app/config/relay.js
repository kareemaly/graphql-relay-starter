import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import { getToken } from 'app/utils/token';

const {
  GRAPHQL_PORT,
  GRAPHQL_HOST,
} = process.env;

const makeURL = () => {
  if (!GRAPHQL_PORT || !GRAPHQL_HOST) {
    return '/graphql';
  }

  return `http://${GRAPHQL_HOST}:${GRAPHQL_PORT}/graphql`;
};

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(
  operation,
  variables,
) {
  return fetch(makeURL(), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `JWT ${getToken()}`,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => response.json());
}

const source = new RecordSource();
const store = new Store(source);
const network = Network.create(fetchQuery);

const environment = new Environment({
  network,
  store,
});

export default environment;
