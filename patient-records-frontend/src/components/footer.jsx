import { Shield } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Shield size={24} />
          <span>MedChain Secure</span>
        </div>
        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div className="footer-copyright">&copy; {currentYear} MedChain Secure. All rights reserved.</div>
    </footer>
  )
}

export default Footer
