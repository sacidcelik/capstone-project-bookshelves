import NavFooter from './components/NavFooter';
import { Switch, Route } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import CompartmentPage from './pages/CompartmentPage';
import MyShelves from './pages/MyShelves';
import MyBooks from './pages/MyBooks';
import Header from './components/Header';
import BookDetails from './components/BookDetails';
import CreateShelf from './pages/CreateShelf';
import getTodaysDate from './services/getDate';
import Start from './pages/Start';
import Access from './pages/Access';

function App() {
  const [library, setLibrary] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [view, setView] = useState('');
  const [detailedBook, setDetailedBook] = useState({});
  const [detailedShelf, setDetailedShelf] = useState({
    compartment: { id: 123 },
  });
  const [detailedCompartmentBooks, setDetailedCompartmentBooks] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);

  function toggleToAndFromLibrary(focusedBook) {
    isInLibrary(focusedBook)
      ? removeFromLibrary(focusedBook)
      : addToLibrary(focusedBook);
  }

  function addToLibrary(focusedBook) {
    focusedBook.addToLibraryDate = getTodaysDate();
    setLibrary([...library, focusedBook]);
  }

  function removeFromLibrary(focusedBook) {
    const remainingLibrary = library.filter(
      (book) => book.id !== focusedBook.id
    );
    setLibrary(remainingLibrary);
  }

  function isInLibrary(focusedBook) {
    return library.find((book) => book.id === focusedBook.id);
  }

  function renderBookDetailsHelper(book) {
    setDetailedBook(book);
    setView('details');
  }

  function updateBook(property, value, bookToUpdate) {
    const updatedBooks = library.map((book) => {
      if (book.id === bookToUpdate.id) {
        book[property] = value;
      }
      return book;
    });
    setLibrary(updatedBooks);
  }

  function updateBooksInCompartment(property, selection, book) {
    const updatedShelves = shelves.map((shelf) => {
      if (shelf.id === selection.bookshelfId) {
        shelf.columns.map((column) => {
          if (column.id === selection.columnId) {
            column.compartments.map((compartment) => {
              if (compartment.id === selection.compartmentId) {
                let existingBooks;
                compartment[property]
                  ? (existingBooks = compartment[property])
                  : (existingBooks = []);
                existingBooks.length === 0
                  ? (compartment[property] = [book.id])
                  : (compartment[property] = [...existingBooks, book.id]);
              }
              return compartment;
            });
          }

          return column;
        });
      }
      shelf.storedBooks = 0;
      shelf.columns.forEach((column) =>
        column.compartments.forEach((compartment) => {
          const sum = compartment.storedBooks
            ? compartment.storedBooks.reduce((acc, element) => {
                if (element) acc++;
                return acc;
              }, 0)
            : 0;
          return (shelf.storedBooks += sum);
        })
      );
      return shelf;
    });
    setShelves(updatedShelves);
  }

  console.log(shelves);

  function addRating(rating, bookToUpdate) {
    updateBook('rating', rating, bookToUpdate);
  }

  function addShelf(shelf) {
    setShelves([...shelves, shelf]);
  }

  function addRefToBookAndShelf(location, bookToUpdate) {
    updateBook('shelfLocation', location, bookToUpdate);
    updateBooksInCompartment('storedBooks', location, bookToUpdate);
  }

  function getBookLocation(book) {
    if (book.shelfLocation) {
      const shelf = shelves.find(
        (shelf) => shelf.id === book.shelfLocation.bookshelfId
      );
      const column = shelf.columns.find(
        (column) => column.id === book.shelfLocation.columnId
      );
      const compartment = column.compartments.find(
        (compartment) => compartment.id === book.shelfLocation.compartmentId
      );
      return `${shelf.name}, Column ${column.column}, Compartment ${compartment.compartment}`;
    } else {
      return `Not stored in a shelf.`;
    }
  }

  function getCompartmentBooks(storedBookIds) {
    const storedBooks = [];
    if (storedBookIds && storedBookIds.length > 0) {
      storedBookIds.map((bookId) =>
        library.map((book) => {
          if (book.id === bookId) storedBooks.push(book);
          return storedBooks;
        })
      );
      return setDetailedCompartmentBooks(storedBooks);
    } else {
      return setDetailedCompartmentBooks([]);
    }
  }

  function getShelfBookImages(shelf) {
    const shelfBooks = [];
    if (shelf) {
      shelf.columns.forEach((column, columnIndex) => {
        shelfBooks.push([]);
        column.compartments.forEach((compartment) =>
          compartment.storedBooks
            ? shelfBooks[columnIndex].push([...compartment.storedBooks])
            : shelfBooks[columnIndex].push([])
        );
      });
      shelfBooks.map((columnBooks, shelfBooksColumnIndex) =>
        columnBooks.map((compartmentBooks, compartmentIndex) => {
          compartmentBooks.map((bookId, bookIndex) =>
            library.map((book) => {
              if (book.id === bookId) {
                shelfBooks[shelfBooksColumnIndex][compartmentIndex][bookIndex] =
                  book.volumeInfo?.imageLinks?.thumbnail;
                return shelfBooks;
              }
              return compartmentBooks;
            })
          );
          return columnBooks;
        })
      );
      return shelfBooks;
    }
  }

  function provideDetailedShelfHelper(shelf, column, compartment) {
    const detailedShelfCompartment = {
      shelf: shelf,
      column: column,
      compartment: compartment,
    };
    setDetailedShelf(detailedShelfCompartment);
  }

  function renderBookDetails(book) {
    return (
      <BookDetails
        book={book}
        onRemoveDetailView={() => setView('')}
        onAddRating={addRating}
        onGetBookLocation={getBookLocation}
      />
    );
  }
  console.log(isNewUser);
  return (
    <>
      <StyledToastContainer />

      <Switch>
        <Route exact path="/">
          <Start onSetIsNewUser={setIsNewUser} />
        </Route>
        <Route exact path="/accessPage">
          <Header noLink />
          <Access isNewUser={isNewUser} />
        </Route>
        <Route path="/home">
          <Header />
          {view === 'details' && renderBookDetails(detailedBook)}
          <Home
            onToggleToAndFromLibrary={toggleToAndFromLibrary}
            isInLibrary={isInLibrary}
            shelves={shelves}
            onSelectShelf={addRefToBookAndShelf}
            library={library}
            onRenderBookDetails={renderBookDetailsHelper}
          />
          <NavFooter />
        </Route>
        <Route exact path="/myshelves">
          <Header />
          <MyShelves
            onSaveShelf={addShelf}
            shelves={shelves}
            onGetCompartmentBooks={getCompartmentBooks}
            onProvideDetailedShelf={provideDetailedShelfHelper}
            detailedCompartmentBooks={detailedCompartmentBooks}
            onGetShelfBooks={getShelfBookImages}
          />
          <NavFooter />
        </Route>
        <Route path="/myshelves/createshelf">
          <Header />
          <CreateShelf onSaveShelf={addShelf} />
          <NavFooter />
        </Route>
        <Route path={`/myshelves/${detailedShelf.compartment.id}`}>
          <Header />
          {view === 'details' && renderBookDetails(detailedBook)}
          <CompartmentPage
            onRenderBookDetails={renderBookDetailsHelper}
            detailedCompartmentBooks={detailedCompartmentBooks}
            detailedShelf={detailedShelf}
          />
          <NavFooter />
        </Route>
        <Route path="/mybooks">
          <Header />
          {view === 'details' && renderBookDetails(detailedBook)}
          <MyBooks
            library={library}
            onRenderBookDetails={renderBookDetailsHelper}
          />
          <NavFooter />
        </Route>
      </Switch>
    </>
  );
}
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast--success {
    background-color: var(--tertiary);
  }
`;

export default App;
