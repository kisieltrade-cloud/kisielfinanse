import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">NYSETHTRADING</div>

      <ul className="footer-links">
        <li><Link href="/polityka-prywatnosci">Polityka prywatności</Link></li>
        <li><Link href="/disclaimer">Disclaimer</Link></li>
        <li><a href="mailto:kontakt@nysethtrading.pl">Kontakt</a></li>
      </ul>

      <div className="footer-disclaimer">
        Trading wiąże się z ryzykiem utraty kapitału. Treści na tej stronie
        mają charakter edukacyjny i nie stanowią doradztwa inwestycyjnego.
        © {new Date().getFullYear()} NysethTrading
      </div>
    </footer>
  );
}
