import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ReasonSelect,
  ReasonTextarea,
  ModalButtons,
  ModalCancelButton,
  ModalSubmitButton,
} from '../ReviewCenter.styled'
function RejectModal({ isOpen, onClose, onSubmit, reason, setReason, notes, setNotes }) {
  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Reject Post</ModalTitle>
        <ReasonSelect value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">Select rejection reason...</option>
          <option value="Fake/Manipulated Image">Fake/Manipulated Image</option>
          <option value="Misinformation/Fake News">Misinformation/Fake News</option>
          <option value="Spam/Promotional Content">Spam/Promotional Content</option>
          <option value="Inappropriate Content">Inappropriate Content</option>
          <option value="Plagiarized Content">Plagiarized Content</option>
          <option value="Hate Speech/Harassment">Hate Speech/Harassment</option>
          <option value="Copyright Violation">Copyright Violation</option>
          <option value="Other">Other</option>
        </ReasonSelect>
        <ReasonTextarea
          placeholder="Add additional notes (optional)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <ModalButtons>
          <ModalCancelButton onClick={onClose}>
            Cancel
          </ModalCancelButton>
          <ModalSubmitButton onClick={onSubmit}>
            Reject Post
          </ModalSubmitButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  )
}
export default RejectModal
