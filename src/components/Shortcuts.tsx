import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { IoMdAdd, IoMdCloseCircleOutline } from 'react-icons/io'; // Added IoMdCloseCircleOutline
import { supabase } from '@/lib/supabaseClient'; // Import supabase

// --- Data Type ---
interface Shortcut {
  id: number;
  name: string;
  url: string;
}

// --- Styled Components ---
const ShortcutsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 800px; // Increased max-width to allow more items in a row

  @media (max-width: 768px) {
    max-width: 100%;
    gap: 15px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const ShortcutItemBase = styled.a`
  position: relative; // For delete button positioning
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px; // Fixed width for each item
  height: 90px;
  padding: 10px;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #e8eaed;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
  }
`;

const ShortcutIcon = styled.img`
  width: 32px;
  height: 32px;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const ShortcutName = styled.span`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const AddShortcutButton = styled(ShortcutItemBase.withComponent('button'))`
  border: none;
  cursor: pointer;
  font-family: inherit;
`;

const AddIconWrapper = styled.div`
  font-size: 2em;
  width: 32px;
  height: 32px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 1.8em;
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    font-size: 1.5em;
    width: 24px;
    height: 24px;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 1.2em;
  padding: 0;
  line-height: 1;
  &:hover {
    color: #ff6b6b;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #282c34;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #5f6368;
  background-color: #303134;
  color: #e8eaed;
  font-size: 16px;
`;

const ModalLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  background-color: #8ab4f8;
  color: #202124;

  &.cancel {
    background-color: #5f6368;
    color: #e8eaed;
  }
`;


// --- Component ---
const Shortcuts = () => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const fetchShortcuts = async () => {
    const { data } = await supabase
      .from('shortcuts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8); // Fetch only the latest 8

    if (data) {
      setShortcuts(data);
    }
  };

  useEffect(() => {
    fetchShortcuts();
  }, []);

  const handleAddShortcut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newUrl.trim()) {
      const { data: insertedData, error: insertError } = await supabase
        .from('shortcuts')
        .insert({ name: newName, url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}` })
        .select(); // Select the inserted data to get its ID and created_at

      if (insertError) {
        console.error('Error adding shortcut:', insertError);
      } else if (insertedData) {
        // Re-fetch to ensure we have the latest 8 and correct order
        fetchShortcuts();
      }
      setNewName('');
      setNewUrl('');
      setShowModal(false);
    }
  };

  const handleDeleteShortcut = async (id: number) => {
    const { error } = await supabase
      .from('shortcuts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting shortcut:', error);
    }
    else {
      // Filter out the deleted shortcut from the current state
      setShortcuts(shortcuts.filter(shortcut => shortcut.id !== id));
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const urlObject = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=32`;
    } catch (error) {
      return 'favicon.ico'; // Fallback icon
    }
  };

  return (
    <>
      <ShortcutsContainer>
        {shortcuts.map(shortcut => (
          <ShortcutItemBase key={shortcut.id} href={shortcut.url} target="_blank" rel="noopener noreferrer">
            <DeleteButton onClick={(e) => { e.preventDefault(); handleDeleteShortcut(shortcut.id); }} aria-label="Delete shortcut">
              <IoMdCloseCircleOutline />
            </DeleteButton>
            <ShortcutIcon src={getFaviconUrl(shortcut.url)} alt={`${shortcut.name} favicon`} />
            <ShortcutName>{shortcut.name}</ShortcutName>
          </ShortcutItemBase>
        ))}
        {shortcuts.length < 8 && (
          <AddShortcutButton onClick={() => setShowModal(true)}>
            <AddIconWrapper><IoMdAdd /></AddIconWrapper>
            <ShortcutName>Add Shortcut</ShortcutName>
          </AddShortcutButton>
        )}
      </ShortcutsContainer>

      {showModal && (
        <ModalBackdrop>
          <ModalContent>
            <h2>Add Shortcut</h2>
            <form onSubmit={handleAddShortcut}>
              <ModalLabel htmlFor="name">Name</ModalLabel>
              <ModalInput
                id="name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <ModalLabel htmlFor="url">URL</ModalLabel>
              <ModalInput
                id="url"
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="example.com"
                required
              />
              <ModalButtonContainer>
                <ModalButton className="cancel" type="button" onClick={() => setShowModal(false)}>Cancel</ModalButton>
                <ModalButton type="submit">Done</ModalButton>
              </ModalButtonContainer>
            </form>
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  );
};

export default Shortcuts;
