import styled from '@emotion/styled';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi'; // Import search icon

const SearchContainer = styled.div`
  margin: 40px 0;
  width: 100%;
  max-width: 600px;
  position: relative;
  display: flex; // Use flexbox to align input and button
  align-items: center;
`;

const SearchInput = styled.input`
  flex-grow: 1; // Allow input to take available space
  padding: 14px 24px;
  border-radius: 30px;
  border: 1px solid #dadce0; // Lighter border for white background
  background-color: #ffffff; // White background
  color: #202124; // Dark text for readability
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); // More subtle shadow
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 10px rgba(0,0,0,0.2); // More subtle hover shadow
  }

  &:focus {
    outline: none;
    border-color: #4285f4; // Google blue for focus
    background-color: #ffffff; // Keep white on focus
  }
`;

const SearchButton = styled.button`
  background-color: transparent; // No background color
  color: #202124; // Black icon
  border: none;
  border-radius: 30px;
  padding: 14px 20px;
  margin-left: -50px; // Overlap with input for a seamless look
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease; // Transition color too
  z-index: 1; // Ensure button is above input

  svg {
    font-size: 1.2em;
  }
`;

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirect to Google search results page
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex' }}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Google 검색 또는 URL 입력"
        />
        <SearchButton type="submit" aria-label="Search">
          <FiSearch />
        </SearchButton>
      </form>
    </SearchContainer>
  );
};

export default SearchBar;
