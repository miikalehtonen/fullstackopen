import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data.allBooks;
  const genres = Array.from(new Set(books.flatMap(book => book.genres)));

  return (
    <div>
      <h2>books</h2>
      {selectedGenre ? <p>in genre <b>{selectedGenre}</b></p> : <p>all genres</p>}
      
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
