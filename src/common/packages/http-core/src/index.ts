/*import * as yup from 'yup';

import { HttpSource, Fetch } from './high-level-api';

(async () => {
  class Swapi extends HttpSource {
    constructor() {
      super('https://swapi.dev/api');
    }

    getPeople = (): Fetch<{ results: { name: string }[] }> => {
      return this
        .get<{ results: { name: string }[] }>('people')
        .onExec(fetch => console.log('request URL:', fetch.getURL()));
    }

    getPerson = (id: number): Fetch<{ name: string }> => {
      return this
        .get<{ name: string }>(`people/${id}`)
        .onExec(fetch => console.log('request URL:', fetch.getURL()));
    }

    getPersonV2 = (id: number, query?: any): Fetch<{ name: string }> => {
      return this
        .get<{ name: string }>('people/:id')
        .setPathSchema(yup.object({ id: yup.number().integer().positive() }))
        .setQuerySchema(yup.object({ page: yup.number().integer().positive() }))
        .onExec(fetch => console.log('request URL:', fetch.getURL()))
        .setPathParam('id', id)
        .setQueryParams(query);
    }
  }

  const swapi = new Swapi();

  const divide = () => console.log('-'.repeat(25));

  divide();
  console.log('people:');
  const people = await swapi.getPeople();
  console.log('people', people.data.results.map(p => p.name));
  divide();

  divide();
  console.log('person(1):');
  const person = await swapi.getPerson(1);
  console.log('person', person.data.name)
  divide();

  divide();
  console.log('personV2(1):');
  const personV2 = await swapi.getPersonV2(1, { page: '1' });
  console.log('person', personV2.data.name)
  divide();
})();
*/
export { AxiosInstance } from 'axios';

export * from './low-level-api';
export * from './high-level-api';
export * from './types';
export * from './utils';
