import styled from "styled-components";
export const CreatePostContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
`;
export const PostCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;
export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;
export const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;
export const UserInfo = styled.div`
  flex: 1;
`;
export const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
`;
export const PostVisibility = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;
export const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  &:focus {
    border-color: #14b8a6;
  }
  &::placeholder {
    color: #9ca3af;
  }
`;
export const CharacterCount = styled.div`
  text-align: right;
  font-size: 0.875rem;
  color: ${(props) => (props.$isOverLimit ? "#ef4444" : "#6b7280")};
  margin-top: 0.5rem;
`;
export const MediaUploadSection = styled.div`
  margin-top: 1.5rem;
`;
export const UploadArea = styled.div`
  border: 2px dashed ${(props) => (props.$isDragging ? "#14b8a6" : "#d1d5db")};
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  background-color: ${(props) => (props.$isDragging ? "#f0fdfa" : "#f9fafb")};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #14b8a6;
    background-color: #f0fdfa;
  }
`;
export const UploadIcon = styled.div`
  color: #14b8a6;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const UploadText = styled.div`
  color: #6b7280;
  font-size: 0.9375rem;
  margin-bottom: 0.5rem;
`;
export const UploadHint = styled.div`
  color: #9ca3af;
  font-size: 0.8125rem;
`;
export const HiddenFileInput = styled.input`
  display: none;
`;
export const MediaPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;
export const MediaPreviewItem = styled.div`
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 1;
  background-color: #f3f4f6;
`;
export const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
export const MediaVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
export const RemoveMediaButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  &:hover {
    background-color: #ef4444;
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;
export const ActionButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
`;
export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #e5e7eb;
  }
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;
export const CategorySection = styled.div`
  margin-top: 1.5rem;
`;
export const SectionLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
`;
export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
`;
export const CategoryButton = styled.button`
  padding: 0.75rem;
  border: 2px solid ${(props) => (props.$isSelected ? "#14b8a6" : "#e5e7eb")};
  background-color: ${(props) => (props.$isSelected ? "#f0fdfa" : "white")};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    border-color: #14b8a6;
    background-color: #f0fdfa;
  }
`;
export const CategoryIcon = styled.div`
  font-size: 1.5rem;
`;
export const CategoryName = styled.div`
  font-size: 0.875rem;
  color: ${(props) => (props.$isSelected ? "#14b8a6" : "#6b7280")};
  font-weight: ${(props) => (props.$isSelected ? "600" : "400")};
`;
export const HashtagSection = styled.div`
  margin-top: 1.5rem;
`;
export const HashtagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;
export const HashtagBadge = styled.span`
  padding: 0.5rem 0.75rem;
  background-color: #f0fdfa;
  color: #14b8a6;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
export const RemoveHashtagButton = styled.button`
  background: none;
  border: none;
  color: #14b8a6;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 1rem;
  &:hover {
    color: #0d9488;
  }
`;
export const SubmitSection = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;
export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #d1d5db;
    background-color: #f9fafb;
  }
`;
export const SubmitButton = styled.button`
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;
export const PreviewSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
`;
export const PreviewTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;
