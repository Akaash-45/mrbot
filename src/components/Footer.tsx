import { Code, Linkedin, Twitter, Mail, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-6 w-full backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-900 dark:text-gray-100 font-medium">
              Built with ❤️ by <span className="font-bold">Akash</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              © {new Date().getFullYear()} MRBOT • Your AI-Powered Assistant
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <a 
              href="https://github.com/akash45" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-10You said:
from where can i get client id and client secret for github cofiguraion login for firebase
ChatGPT said:

To enable GitHub authentication for your Firebase app, you need to obtain the Client ID and Client Secret from GitHub. Here’s how you can do it step-by-step:
0 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="GitHub"
              title="GitHub"
            >
              <Code className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/in/your-linkedin-id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="https://x.com/xnor404" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="X (Twitter)"
              title="X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="mailto:your-email@example.com" 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Email"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a 
              href="tel:+919346968655" 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Phone"
              title="Phone"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
