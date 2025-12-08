import { LogOut, Menu } from "lucide-react";

type HeaderProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
  onSignInOpen: () => void;
  isMobile: boolean;
  onMenuToggle: () => void;
};

export default function Header({
  isAuthenticated,
  onLogout,
  onSignInOpen,
  isMobile,
  onMenuToggle
}: HeaderProps) {
  return (
    <header className="header">
      <div
        className="headerLeft"
        onClick={() => (window.location.href = "/")}
        style={{ cursor: "pointer" }}
      >
        <img src="/Logo.png" alt="FramerKit" className="logo" />
        <h1>FramerKit</h1>
      </div>

      <div className="headerActions">
        {!isMobile && (
          <>
            {isAuthenticated ? (
              <button className="logoutButton" onClick={onLogout}>
                <LogOut size={16} />
                Log out
              </button>
            ) : (
              <>
                <button className="loginButton" onClick={onSignInOpen}>
                  Log in
                </button>
                <button
                  className="authButton"
                  onClick={() =>
                    window.open("https://gum.co/framerkit", "_blank")
                  }
                >
                  Get Full Access
                </button>
              </>
            )}
          </>
        )}

        {isMobile && (
          <button className="hamburgerButton" onClick={onMenuToggle}>
            <Menu size={24} />
          </button>
        )}
      </div>
    </header>
  );
}
