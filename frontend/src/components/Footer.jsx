const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row">
        <p>© {year} Sociala. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="/about" className="hover:text-slate-800">
            About
          </a>
          <a href="/contact" className="hover:text-slate-800">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;