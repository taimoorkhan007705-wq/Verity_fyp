import styled from "styled-components";
export const RightSidebarContainer = styled.div`
  width: 18rem;
  background-color: white;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1.5rem;
  overflow-y: auto;
  @media (max-width: 1024px) {
    display: none;
  }
`;
export const RightSidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;
export const RightSidebarContent = styled.div`
  flex: 1;
`;
