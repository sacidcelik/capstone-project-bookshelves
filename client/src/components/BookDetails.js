import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { useState } from 'react';
import UnreadReadButton from './UnreadReadButton';
import ShelfEditor from './ShelfEditor';
import CloseIcon from '../images/closeIcon.svg';
import EditPencil from '../images/editPencil.svg';

import BookRating from './BookRating';

export default function BookDetails({
  book,
  isStatic,
  onRemoveDetailView,
  onAddRating,
  onGetBookLocation,
  onSelectShelf,
  shelves,
}) {
  const [isSelector, setIsSelector] = useState(false);

  function editHandler() {
    setIsSelector(!isSelector);
  }

  return (
    <>
      {isSelector && (
        <ShelfEditor
          shelves={shelves}
          book={book}
          onSetIsSelector={setIsSelector}
          onSelectShelf={onSelectShelf}
        />
      )}
      <DetailsCard isStatic={isStatic} data-test-id="book-details">
        <CloseButton
          src={CloseIcon}
          alt="Close Icon"
          onClick={onRemoveDetailView}
        />
        <BookInformation>
          <BookImageWrapper>
            <img
              src={
                book.volumeInfo?.imageLinks?.thumbnail ||
                book.volumeInfo?.imageLinks?.smallThumbnail
              }
              alt={book.volumeInfo?.title || 'Book Cover'}
              width="128"
              height="192"
            />
            <UnreadReadButton />
          </BookImageWrapper>

          <BookSpecs>
            <BookTitle>{book.volumeInfo?.title}</BookTitle>
            {book.volumeInfo.subtitle && (
              <BookSubTitle>{book.volumeInfo.subtitle}</BookSubTitle>
            )}
            <p>{book.volumeInfo?.authors?.[0]}</p>
            <p>Released: {book.volumeInfo?.publishedDate?.substring(0, 4)}</p>
            <p>ISBN: {book.volumeInfo?.industryIdentifiers[0]?.identifier}</p>
          </BookSpecs>
        </BookInformation>
        <BookSettings>
          <RatingWrapper>
            <p>Rating: </p>
            <RatingStarWrapper>
              <BookRating onAddRating={onAddRating} book={book} />
            </RatingStarWrapper>
          </RatingWrapper>
          <LocationWrapper>
            <p>Location:</p>
            <div>
              <p>{onGetBookLocation(book)}</p>
              <img
                src={EditPencil}
                alt="Edit Location"
                onClick={() => editHandler(book)}
              />
            </div>
          </LocationWrapper>
          <LentWrapper>
            <p>Lent:</p>
            <div>
              <input type="checkbox" /> <input type="name" placeholder="Name" />
              <input type="date" />
            </div>
          </LentWrapper>
          <NotesWrapper>
            <p>Notes:</p>
            <div>
              <textarea placeholder="Your notes" />
            </div>
          </NotesWrapper>
        </BookSettings>
      </DetailsCard>
    </>
  );
}

const DetailsCard = styled.article`
  background-color: var(--background);
  border-radius: var(--border-radius);
  box-shadow: 0 0 100vw 100vh rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: ${(props) => (props.isStatic ? '650px' : '85vh')};
  margin: ${(props) => (props.isStatic ? '0 auto' : '50vh 50vw')};
  opacity: 0.95;
  padding: 1rem;
  position: ${(props) => (props.isStatic ? 'relative' : 'fixed')};
  transform: ${(props) => (props.isStatic ? '' : 'translate(-50%, -65%)')};
  width: ${(props) => (props.isStatic ? '338px' : '90vw')};
  z-index: 100;
`;

const CloseButton = styled.img`
  position: absolute;
  right: -10px;
  top: -10px;
`;

const BookInformation = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
`;

const BookImageWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  justify-content: flex-start;
  width: 40%;

  img {
    box-shadow: var(--box-shadow-offset-x) var(--box-shadow-offset-y)
      var(--box-shadow-blur) var(--box-shadow-color);
    width: 102px;
    height: 154px;
  }
`;

const BookSpecs = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  width: 60%;

  p {
    margin-top: 0.8rem;
  }
`;

const BookTitle = styled.h2`
  font-size: 1.2rem;
  max-height: 4.1rem;
  overflow: hidden;
`;

const BookSubTitle = styled.h5`
  margin: 0;
  margin-top: 0.3rem;
  max-height: 2rem;
  overflow: hidden;
`;

const BookSettings = styled.section`
  input:not([type='checkbox']),
  textarea {
    background: white;
    border: none;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-offset-x) var(--box-shadow-offset-y)
      var(--box-shadow-blur) var(--box-shadow-color);
  }
`;

const RatingWrapper = styled.section`
  margin-top: 1rem;
`;

const RatingStarWrapper = styled.div`
  margin-top: 0.5rem;
`;

const LocationWrapper = styled.section`
  margin-top: 1rem;

  div {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    gap: 0.5rem;
  }
`;

const LentWrapper = styled.section`
  margin-top: 1rem;

  div {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
    margin-top: 0.5rem;
    width: 100%;

    input {
      height: 1.5rem;
    }
    input[type='checkbox'] {
      transform: scale(1.5);
    }
    input[type='name'] {
      width: 9rem;
    }
    input[type='date'] {
      font-family: sans-serif;
    }
  }
`;

const NotesWrapper = styled.section`
  margin-top: 1rem;

  div {
    margin-top: 0.5rem;

    textarea {
      height: 3rem;
      resize: none;
      width: 100%;
    }
  }
`;

BookDetails.propTypes = {
  book: PropTypes.object,
  onRemoveDetailView: PropTypes.func,
  onAddRating: PropTypes.func,
};
