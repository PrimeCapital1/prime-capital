import { useEffect, useRef, useState } from "react";
import { T } from "./translations";
import "./styles.css";

/* Smartsupp: paste your key from Settings > Chat box > Chat code */
const SS_KEY = "937d9ba4f9ea9b6fd1d0924c5d7f5716c30e3f0e";

/* Real photos: put your licensed images in /public/images with these names.
   Free sources: unsplash.com, pexels.com (search "bank building", "bank branch lobby",
   "financial advisor with clients", "happy couple signing documents"). */
const IMAGES = {
  hero: `${import.meta.env.BASE_URL}images/bank-building.jpg`,
  lobby: `${import.meta.env.BASE_URL}images/branch-lobby.jpg`,
  advisor: `${import.meta.env.BASE_URL}images/advisor-with-clients.jpg`,
  customers: `${import.meta.env.BASE_URL}images/happy-customers.jpg`,
};

const B = {
  en: { bh: "Visit us in person", bt: "Talk to an advisor face to face, open an account, or collect a new card.", bb: "Book a visit", ia: "Prime Capital headquarters" },
  es: { bh: "Visítenos en persona", bt: "Hable con un asesor cara a cara, abra una cuenta o recoja una tarjeta nueva.", bb: "Reservar una visita", ia: "Sede de Prime Capital" },
  fr: { bh: "Rendez-nous visite", bt: "Parlez à un conseiller en face à face, ouvrez un compte ou retirez une nouvelle carte.", bb: "Réserver une visite", ia: "Siège de Prime Capital" },
  ar: { bh: "زرنا شخصيًا", bt: "تحدث مع مستشار وجهًا لوجه، أو افتح حسابًا، أو استلم بطاقة جديدة.", bb: "احجز زيارة", ia: "المقر الرئيسي لبنك Prime Capital" },
  id: { bh: "Kunjungi kami langsung", bt: "Bicara dengan penasihat secara langsung, buka rekening, atau ambil kartu baru.", bb: "Jadwalkan kunjungan", ia: "Kantor pusat Prime Capital" },
  ms: { bh: "Lawati kami secara peribadi", bt: "Berbual dengan penasihat secara bersemuka, buka akaun, atau ambil kad baharu.", bb: "Tempah lawatan", ia: "Ibu pejabat Prime Capital" },
  th: { bh: "แวะมาหาเรา", bt: "พูดคุยกับที่ปรึกษาแบบเห็นหน้ากัน เปิดบัญชี หรือรับบัตรใหม่", bb: "จองเวลาเข้าพบ", ia: "สำนักงานใหญ่ Prime Capital" },
};

const TOPICS = ["cards", "transfers", "fraud", "loans", "online", "accounts"];

function Photo({ src, alt = "", className = "" }) {
  const [ok, setOk] = useState(true);
  if (!ok) return <div className={`${className} ph`} aria-hidden="true" />;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setOk(false)} />;
}

export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      const s = localStorage.getItem("pc_lang");
      if (s && T[s]) return s;
    } catch {}
    const n = (navigator.language || "en").slice(0, 2);
    return T[n] ? n : "en";
  });
  const t = { ...T[lang], ...B[lang] };
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("cards");
  const [sent, setSent] = useState(false);
  const [ss, setSs] = useState(false);
  const [fb, setFb] = useState(false);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [draft, setDraft] = useState("");
  const msgField = useRef(null);
  const msgBox = useRef(null);

  /* Language: <html lang/dir>, remember choice, tell Smartsupp */
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("pc_lang", lang); } catch {}
    setSent(false);
    if (ss && window.smartsupp) {
      try { window.smartsupp("language", lang); } catch {}
    }
  }, [lang, ss]);

  /* Smartsupp loader, with built-in chat as fallback */
  useEffect(() => {
    if (SS_KEY === "YOUR_SMARTSUPP_KEY") { setFb(true); return; }
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = SS_KEY;
    if (window.smartsupp) { setSs(true); return; }
    const o = (window.smartsupp = function () { o._.push(arguments); });
    o._ = [];
    const c = document.createElement("script");
    c.async = true;
    c.charset = "utf-8";
    c.src = "https://www.smartsuppchat.com/loader.js?";
    c.onload = () => setSs(true);
    c.onerror = () => setFb(true);
    document.head.appendChild(c);
  }, []);

  useEffect(() => {
    if (msgBox.current) msgBox.current.scrollTop = msgBox.current.scrollHeight;
  }, [msgs, open]);

  const openChat = () => {
    if (ss && window.smartsupp) {
      try { window.smartsupp("chat:open"); return; } catch {}
    }
    setFb(true);
    setOpen((o) => !o);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { me: true, text: draft }]);
    setDraft("");
    setTimeout(() => setMsgs((m) => [...m, { me: false }]), 700);
  };

  const pickTopic = (k) => {
    setTopic(k);
    document.getElementById("contact").scrollIntoView();
    msgField.current?.focus();
  };

  const q = query.trim().toLowerCase();
  const faqs = [1, 2, 3, 4]
    .map((n) => ({ q: t["q" + n], r: t["r" + n] }))
    .filter((f) => !q || (f.q + f.r).toLowerCase().includes(q));

  return (
    <>
      <header>
        <div className="wrap">
          <a className="logo" href="#top">
            <i>PC</i>
            <span>Prime Capital<small>{t.tag}</small></span>
          </a>
          <nav aria-label="Main">
            <a href="#help">{t.n1}</a>
            <a href="#faq">{t.n2}</a>
            <a href="#contact">{t.n3}</a>
            <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="id">Bahasa Indonesia</option>
              <option value="ms">Bahasa Melayu</option>
              <option value="th">ไทย</option>
            </select>
          </nav>
        </div>
      </header>

      <section className="hero-x" id="top">
        <Photo src={IMAGES.hero} alt={t.ia} className="bg" />
        <div className="wrap hx">
          <div>
            <h1>{t.h1}</h1>
            <p>{t.sub}</p>
            <input type="search" value={query} placeholder={t.ph} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
          </div>
          <aside className="panel">
            <span className="k">{t.call}</span>
            <a className="big" href="tel:+1(814)876-0690" dir="ltr">+1(814)876-0690</a>
            <span className="k">{t.mail}</span>
            <a className="mail" href="mailto:support@primecapital.bank" dir="ltr">support@primecapital.bank</a>
            <p className="hrs">{t.hrs}</p>
            <button className="btn" onClick={openChat}>{t.chat}</button>
          </aside>
        </div>
      </section>

      <main className="wrap">
        <div className="alert top">
          <b>{t.a1}</b>
          <span>{t.a2}</span>
        </div>

        <section id="help">
          <h2>{t.h2a}</h2>
          <ul className="topics">
            {TOPICS.map((k, i) => (
              <li key={k}><button onClick={() => pickTopic(k)}>{t["t" + (i + 1)]}</button></li>
            ))}
          </ul>
        </section>

        <section className="split">
          <div>
            <h2>{t.bh}</h2>
            <p>{t.bt}</p>
            <a className="btn" href="#contact">{t.bb}</a>
          </div>
          <div className="photos">
            <Photo src={IMAGES.lobby} className="p1" />
            <Photo src={IMAGES.advisor} />
            <Photo src={IMAGES.customers} />
          </div>
        </section>

        <section id="faq">
          <h2>{t.h2b}</h2>
          {faqs.map((f) => (
            <details key={f.q} open={!!q}>
              <summary>{f.q}</summary>
              <p>{f.r}</p>
            </details>
          ))}
        </section>

        <section id="contact">
          <h2>{t.h2c}</h2>
          <form
            className="form"
            onSubmit={(e) => { e.preventDefault(); setSent(true); e.target.reset(); }}
          >
            <label><span>{t.f1}</span><input required name="n" autoComplete="name" /></label>
            <label><span>{t.f2}</span><input required type="email" name="e" autoComplete="email" dir="ltr" /></label>
            <label>
              <span>{t.f3}</span>
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                {TOPICS.map((k, i) => <option key={k} value={k}>{t["t" + (i + 1)]}</option>)}
                <option value="other">{t.t7}</option>
              </select>
            </label>
            <label><span>{t.f4}</span><textarea ref={msgField} required /></label>
            <button className="btn" type="submit">{t.send}</button>
            <p id="ok" role="status">{sent ? t.sent : ""}</p>
          </form>
        </section>
      </main>

      <footer><div className="wrap">{t.foot}</div></footer>

      <div id="fb" className={fb ? "on" : ""}>
        <div id="cp" className={open ? "open" : ""} role="dialog" aria-label="Chat">
          <h3>{t.ct}</h3>
          <div id="msgs" ref={msgBox} aria-live="polite">
            <div>{t.cg}</div>
            {msgs.map((m, i) => (
              <div key={i} className={m.me ? "me" : ""}>{m.me ? m.text : t.cr}</div>
            ))}
          </div>
          <form id="cf" onSubmit={sendChat}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t.cph} autoComplete="off" />
            <button className="btn">{t.cs}</button>
          </form>
        </div>
        <button className="btn" onClick={openChat}>{t.chat}</button>
      </div>
    </>
  );
}