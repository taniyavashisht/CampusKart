import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, redirectTo = '/' }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLoginRedirect = () => {
        onClose();
        const url = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login';
        navigate(url);
    };

    const handleSignupRedirect = () => {
        onClose();
        const url = redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : '/signup';
        navigate(url);
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                {/* Close Button */}
                <button className="auth-modal-close" onClick={onClose}>
                    ✕
                </button>

                <div className="auth-content">
                    <h3 className="auth-title">Join the Conversation! 💬</h3>
                    <p className="auth-subtitle">
                        Login or create an account to start chatting with sellers and buyers on CampusKart
                    </p>

                    <div className="auth-options">
                        <button 
                            className="auth-option-btn primary"
                            onClick={handleLoginRedirect}
                        >
                            📱 Login to Your Account
                        </button>
                        
                        <button 
                            className="auth-option-btn secondary"
                            onClick={handleSignupRedirect}
                        >
                            🎓 Create New Account
                        </button>
                    </div>

                    <div className="auth-features">
                        <div className="auth-feature">
                            <span className="feature-icon">💬</span>
                            <span>Chat with sellers directly</span>
                        </div>
                        <div className="auth-feature">
                            <span className="feature-icon">🛡️</span>
                            <span>Secure campus-only platform</span>
                        </div>
                        <div className="auth-feature">
                            <span className="feature-icon">⚡</span>
                            <span>Quick and easy setup</span>
                        </div>
                    </div>

                    <p className="auth-note">
                        Only students with college email addresses can join CampusKart
                    </p>
                </div>
            </div>
        </div>
    );
}