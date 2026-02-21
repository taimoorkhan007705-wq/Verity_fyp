import styled from "styled-components";

export const LayoutContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
`;

export const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  max-width: 100%;
`;

export const MobileToggleButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 60;
  background-color: white;
  border: none;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f9fafb;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 640px) {
    display: none;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 25;
  display: ${(props) => (props.$isOpen ? "block" : "none")};

  @media (min-width: 640px) {
    display: none;
  }
`;
