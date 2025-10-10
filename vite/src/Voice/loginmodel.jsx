// LoginModal.jsx
import "./loginModal.css";

export default function LoginModal({ onClose, onLoginRedirect }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Login Required</h3>
        <p>You must be logged in to talk with personalities.</p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn login" onClick={onLoginRedirect}>Login</button>
        </div>
      </div>
    </div>
  );
}
