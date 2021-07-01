import PropTypes from 'prop-types';
import styled from 'styled-components';

export default function UnreadReadButton({ bookIsRead, onToggleBookIsRead }) {
  return (
    <ToggleButton
      data-test-id="unread-read-button"
      onClick={onToggleBookIsRead}
      isRead={bookIsRead}
    >
      {bookIsRead ? 'READ' : 'UNREAD'}
    </ToggleButton>
  );
}

const ToggleButton = styled.button`
  background: ${(props) =>
    props.isRead ? 'var(--tertiary)' : 'var(--primary)'};
  color: ${(props) => (props.isRead ? 'var(--background)' : 'black')};
  border: none;
  border-radius: var(--border-radius);
  height: 30px;
  padding: 0.32rem 0.5rem 0.3rem 0.5rem;
  width: 102px;
`;

UnreadReadButton.propTypes = {
  bookIsRead: PropTypes.bool,
  onToggleBookIsRead: PropTypes.func,
};
