import { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import Notify from "./components/Notify";
import { BOOK_ADDED } from "./queries";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    client.resetStore();
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const newBook = data.data.bookAdded;
      window.alert(
        `New book added: ${newBook.title} by ${newBook.author.name}`
      );

      client.cache.updateQuery({ query: ALL_BOOKS }, (existingData) => {
        if (!existingData) return { allBooks: [addedBook] };

        const alreadyExists = existingData.allBooks.some(
          (book) => book.title === addedBook.title
        );

        if (alreadyExists) {
          return existingData;
        }

        return {
          allBooks: [...existingData.allBooks, addedBook],
        };
      });
    },
  });

  return (
    <Router>
      <div>
        <Notify errorMessage={errorMessage} />
        <nav>
          <Link to="/authors">
            <button>authors</button>
          </Link>
          <Link to="/books">
            <button>books</button>
          </Link>
          {token ? (
            <>
              <Link to="/add">
                <button>add book</button>
              </Link>
              <Link to="/recommend">
                <button>recommend</button>
              </Link>
              <button onClick={logout}>logout</button>
            </>
          ) : (
            <Link to="/login">
              <button>login</button>
            </Link>
          )}
        </nav>

        <Routes>
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route
            path="/add"
            element={token ? <NewBook /> : <p>Please log in to add books.</p>}
          />
          <Route
            path="/login"
            element={<LoginForm setToken={setToken} setError={notify} />}
          />
          <Route path="/recommend" element={<Recommend />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
