import styled from 'styled-components'
export const EditContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: #fff;
  min-height: 100vh;
`
export const EditHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`
export const BackButton = styled.button`
  background: none;
  border: none;
  color: #1f2937;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.2s;
  &:hover {
    background-color: #f3f4f6;
  }
`
export const EditTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`
export const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`
export const ProfileImageEdit = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`
export const ProfileImageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`
export const ProfileImageLarge = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #14b8a6;
`
export const ChangePhotoButton = styled.button`
  padding: 0.625rem 1.5rem;
  background-color: #14b8a6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  &:hover {
    background-color: #0d9488;
  }
`
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`
export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: #1f2937;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
  }
  &::placeholder {
    color: #9ca3af;
  }
`
export const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: #1f2937;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
  }
  &::placeholder {
    color: #9ca3af;
  }
`
export const CharCount = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: right;
`
export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`
export const SaveButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background-color: #14b8a6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover:not(:disabled) {
    background-color: #0d9488;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
export const CancelButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background-color: #f3f4f6;
  color: #1f2937;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #e5e7eb;
  }
`
