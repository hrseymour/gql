import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_OLDEST_PEOPLE = gql`
  query GetOldestPeople($limit: Int!) {
    oldestPeople(limit: $limit) {
      id
      name
      age
    }
  }
`;

interface Person {
  id: string;
  name: string;
  age: number;
}

interface GetOldestPeopleQueryResult {
  oldestPeople: Person[];
}

const HomePage = () => {
  // State for the input
  const [limit, setLimit] = useState(3);

  const { loading, error, data, refetch } = useQuery<GetOldestPeopleQueryResult>(GET_OLDEST_PEOPLE, {
    variables: { limit },
  });

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch({ limit }); // Refetch the query with the new limit
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Oldest People</h1>
      {/* 3. The form for setting the limit */}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          min="1"
          style={{ marginRight: '10px' }} // Some spacing between the input and the button
        />
      </form>
      <ul>
        {data?.oldestPeople.map((person) => (
          <li key={person.id}>
            {person.name} - {person.age}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
