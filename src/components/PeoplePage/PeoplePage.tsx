import React, { useEffect, useState } from 'react';
import { Person } from '../../types';
import { useParams } from 'react-router-dom';
import { getPeople } from '../../api';
import { PersonLink } from '../PersonLink/PersonLink';
import cn from 'classnames';
import { Loader } from '../Loader';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const highlightedPersonSlug: string | null = useParams()?.slug || null;
  const [loadingState, setLoadingState] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(function () {
    setLoadingState(true);
    getPeople()
      .then(res => {
        if (res !== null) {
          setPeople(res);
        }
      })
      .catch(() => {
        setLoadingError(true)
      })
      .finally(() => {
        setLoadingState(false);
      });
  }, []);


  return (
    <React.Fragment>
      <h1 className="title">People Page</h1>

      <div className="box table-container">
        <div className="block">
          {loadingState && <Loader />}

          {loadingError && <p data-cy="peopleLoadingError" className="has-text-danger">Something went wrong</p>}

          {!loadingState && !loadingError && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.length === 0 && <p data-cy="noPeopleMessage">There are no people on the server</p>}
                {people.map(person => {
                  return (
                  <tr
                    data-cy="person"
                    className={cn({
                      'has-background-warning': highlightedPersonSlug === person.slug,
                    })}
                    key={person?.slug}
                  >
                    <PersonLink personData={person} people={people} />

                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>

                    <PersonLink
                      personData={person.motherName ? person.motherName : '-'}
                      people={people} />
                    <PersonLink
                      personData={person.fatherName ? person.fatherName : '-'}
                      people={people} />
                  </tr>
                    )})}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
