"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import clientsData from "../public/assets/data/clients.json";
import { tString, tList, type Lang } from "./i18n/i18n";

type LocalizedText = string | Record<Lang, string>;
type LocalizedList = string[] | Record<Lang, string[]>;

interface Project {
  name: LocalizedText;
  description: Record<Lang, string>;
  year: string;
  type: LocalizedList;
  url?: string;
}

interface Client {
  name: LocalizedText;
  url: string;
  logo: string;
  projects: Project[];
}

const getLocalizedText = (value: LocalizedText, lang: Lang) => {
  if (typeof value === "string") return value;
  return value[lang] ?? value.EN;
};

const getLocalizedList = (value: LocalizedList, lang: Lang) => {
  if (Array.isArray(value)) return value;
  return value[lang] ?? value.EN;
};

const SocialFooter = () => (
  <footer className="mt-auto pt-6">
    <div className="flex justify-center gap-6">
      <a
        href="https://www.linkedin.com/in/sebastian-carewe-84aa0a220"
        target="_blank"
        rel="noopener"
        aria-label="LinkedIn"
        className="text-white/70 hover:text-white/90 transition-colors"
      >
        <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
      </a>
      <a
        href="https://www.github.com/eweracs"
        target="_blank"
        rel="noopener"
        aria-label="GitHub"
        className="text-white/70 hover:text-white/90 transition-colors"
      >
        <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
      </a>
      <a
        href="https://instagram.com/s_carewe"
        target="_blank"
        rel="noopener"
        aria-label="Instagram"
        className="text-white/70 hover:text-white/90 transition-colors"
      >
        <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
      </a>
    </div>
  </footer>
);

interface Section {
  id: number;
  title: string;
  color: string;
  content: React.ReactNode;
}

function renderAboutP1(lang: Lang) {
  const raw = tString(lang, "about.p1");

  const tokens: Array<string | "SCHRIFTLABOR" | "GITHUB" | "\n"> = raw
    .replaceAll("{schriftlaborLink}", "\u0000SCHRIFTLABOR\u0000")
    .replaceAll("{githubLink}", "\u0000GITHUB\u0000")
    .split(/(\u0000SCHRIFTLABOR\u0000|\u0000GITHUB\u0000|\n)/g)
    .filter(Boolean)
    .map((part) => {
      if (part === "\n") return "\n";
      if (part === "\u0000SCHRIFTLABOR\u0000") return "SCHRIFTLABOR";
      if (part === "\u0000GITHUB\u0000") return "GITHUB";
      return part;
    });

  return (
    <p className="text-white/90">
      {tokens.map((part, i) => {
        if (part === "\n") return <br key={`br-${i}`} />;

        if (part === "SCHRIFTLABOR") {
          return (
            <a
              key={`sl-${i}`}
              href="https://schriftlabor.at"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schriftlabor
            </a>
          );
        }

        if (part === "GITHUB") {
          return (
            <a
              key={`gh-${i}`}
              href="https://www.github.com/<USERNAME_PLACEHOLDER>"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          );
        }

        return <span key={`t-${i}`}>{part}</span>;
      })}
    </p>
  );
}

function renderListItems(items: string[]) {
  return (
    <ul className="space-y-2 text-white/80">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

type GridStyle = Pick<
  React.CSSProperties,
  "gridTemplateColumns" | "gridTemplateRows"
>;

function getGridStyle(
  isMobile: boolean,
  activeSection: number | null,
  sectionsLength: number
): GridStyle {
  // Mobile layout: single column, variable row heights
  if (isMobile) {
    if (activeSection === null) {
      return {
        gridTemplateColumns: "1fr",
        gridTemplateRows: Array.from({ length: sectionsLength }, () => "1fr").join(" "),
      };
    }

    const activeIndex = Math.max(0, activeSection - 1);
    const gridRows = Array.from({ length: sectionsLength }, (_, index) =>
      index === activeIndex ? "8fr" : "0.5fr"
    ).join(" ");

    return {
      gridTemplateColumns: "1fr",
      gridTemplateRows: gridRows,
    };
  }

  // Desktop layout: 2x2 grid; active tile gets 4fr in its row/col, others 1fr.
  if (activeSection === null) {
    return { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" };
  }

  const isLeft = activeSection % 2 === 1; // 1,3 => left column; 2,4 => right column
  const isTop = activeSection <= 2; // 1,2 => top row; 3,4 => bottom row

  return {
    gridTemplateColumns: isLeft ? "4fr 1fr" : "1fr 4fr",
    gridTemplateRows: isTop ? "4fr 1fr" : "1fr 4fr",
  };
}

export default function App() {
  const [activeSection, setActiveSection] = useState<number | null>(1);
  const [language, setLanguage] = useState<Lang>("EN");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isAnyActive = activeSection !== null;
  const clients = clientsData as Client[];

  const handleSectionClick = (id: number) => {
    setActiveSection((current) => (current === id ? null : id));
  };

  const sortedClients = useMemo(() => {
    const sorted = [...clients];
    sorted.sort((a, b) =>
      getLocalizedText(a.name, language).localeCompare(
        getLocalizedText(b.name, language)
      )
    );
    return sorted;
  }, [clients, language]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 800);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("lang") as Lang | null;
    if (stored) {
      setLanguage(stored);
      return;
    }

    const browserLang = navigator.language.toLowerCase();
    const detected: Lang = browserLang.startsWith("fr")
      ? "FR"
      : browserLang.startsWith("de")
        ? "DE"
        : "EN";

    setLanguage(detected);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("lang", language);
  }, [language]);

  const otherLanguages: Lang[] = (["FR", "EN", "DE"] as const).filter(
    (l) => l !== language
  );

  const sections: Section[] = useMemo(
    () => [
      {
        id: 1,
        title: tString(language, "nav.hello"),
        color: "bg-emerald-800",
        content: (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="space-y-2">
                <p className="text-white/90">
                  Sebastian Carewe • <i>{tString(language, "hello.meta")}</i>
                </p>

                <p className="text-white/90">{tString(language, "hello.p1")}</p>

                <p className="text-white/90">
                  {tString(language, "hello.contact", {
                    email: "sebastian.carewe",
                  })}
                  <span className="email-protected" />
                </p>
              </div>
            </div>
            <SocialFooter />
          </div>
        ),
      },
      {
        id: 2,
        title: tString(language, "nav.projects"),
        color: "bg-slate-900",
        content: (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-12">
                <p className="text-white/90">
                  {tString(language, "projects.intro")}
                </p>

                {sortedClients.map((client) => {
                  const clientName = getLocalizedText(client.name, language);

                  return (
                  <div key={client.url} className="space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <a
                          href={client.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/90 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <h3>{clientName}</h3>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {client.projects.map((project) => {
                        const projectName = getLocalizedText(
                          project.name,
                          language
                        );
                        const projectDescription = getLocalizedText(
                          project.description,
                          language
                        );
                        const projectTypes = getLocalizedList(
                          project.type,
                          language
                        );

                        return (
                        <div
                          key={`${getLocalizedText(project.name, "EN")}-${project.year}`}
                          className="pl-4 border-l-2 border-white/20"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white/80">{projectName}</h4>
                            <span className="text-white/50 text-sm">
                              {project.year}
                            </span>
                          </div>
                          <p className="text-white/60 mb-3">
                            {projectDescription}
                          </p>

                          <div className="flex gap-2 flex-wrap mb-3">
                            {projectTypes.map((type) => (
                              <span
                                key={type}
                                className="px-3 py-1 bg-white/10 rounded text-sm text-white/70"
                              >
                                {type}
                              </span>
                            ))}
                          </div>

                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/50 hover:text-white/80 transition-colors text-sm flex items-center gap-1"
                            >
                              {tString(language, "projects.viewProject")}{" "}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
            <SocialFooter />
          </div>
        ),
      },
      {
        id: 3,
        title: tString(language, "nav.expertise"),
        color: "bg-amber-700",
        content: (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                <p className="text-white/90 text-base">
                  {tString(language, "expertise.intro")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-white/90 text-xl mb-3">
                      {tString(language, "expertise.designTitle")}
                    </h3>
                    {renderListItems(tList(language, "expertise.designItems"))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white/90 text-xl mb-3">
                      {tString(language, "expertise.technicalTitle")}
                    </h3>
                    {renderListItems(
                      tList(language, "expertise.technicalItems")
                    )}
                  </div>
                </div>
              </div>
            </div>
            <SocialFooter />
          </div>
        ),
      },
      {
        id: 4,
        title: tString(language, "nav.about"),
        color: "bg-blue-900",
        content: (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-12">
                <div>
                  <div className="text-white/90 mb-8">
                    {renderAboutP1(language)}
                  </div>
                </div>
              </div>
            </div>
            <SocialFooter />
          </div>
        ),
      },
    ],
    [language, sortedClients]
  );

  const gridStyle = useMemo(
    () => getGridStyle(isMobile, activeSection, sections.length),
    [isMobile, activeSection, sections.length]
  );

  const getTriangleClipPath = (sectionId: number) => {
    if (sectionId === 1) return "polygon(100% 100%, 0 100%, 100% 0)";
    if (sectionId === 2) return "polygon(0 100%, 100% 100%, 0 0)";
    if (sectionId === 3) return "polygon(100% 0, 0 0, 100% 100%)";
    if (sectionId === 4) return "polygon(0 0, 0 100%, 100% 0)";
    return "polygon(100% 100%, 0 100%, 100% 0)";
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <div className={`fixed right-8 z-30 ${isMobile ? "bottom-8" : "top-8"}`}>
        <div className="w-12 relative">
          <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
                <motion.button
                  key="lang"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-full flex items-center justify-center text-white font-semibold tracking-wide
                  [font-variation-settings:'wght'_500] hover:[font-variation-settings:'wght'_600]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLangMenuOpen((v) => !v);
                  }}
                  aria-label={`Current language: ${language}`}
                  aria-expanded={isLangMenuOpen}
                  aria-haspopup="menu"
                >
                  {language}
                </motion.button>
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {isLangMenuOpen && (
              <motion.div
                key="lang-menu"
                initial={{ opacity: 0, y: isMobile ? 6 : -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isMobile ? 6 : -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={`overflow-hidden ${isMobile ? "absolute bottom-full mb-2 right-0" : "mt-2"}`}
                role="menu"
                aria-label="Language menu"
              >
                <div className="flex flex-col gap-2 items-end">
                  {otherLanguages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm text-white font-semibold tracking-wide [font-variation-settings:'wght'_500] hover:[font-variation-settings:'wght'_600]"
                      aria-label={`Switch language to ${lang}`}
                      role="menuitem"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="grid h-full w-full"
        animate={gridStyle}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;

          return (
            <motion.div
              key={section.id}
              className={`${section.color} relative overflow-hidden`}
              style={{
                gridColumn: isMobile ? "1" : section.id % 2 === 1 ? "1" : "2",
                gridRow: isMobile ? (index + 1).toString() : section.id <= 2 ? "1" : "2",
              }}
            >

              {!isActive && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-white
                  cursor-pointer"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <motion.div
                    initial={false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center"
                  >
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: !isAnyActive ? 0.9 : 0.7,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`text-white italic transition-[font-size] duration-400 ${
                        isMobile
                          ? !isAnyActive
                            ? "text-xl"
                            : "text-base"
                          : !isAnyActive
                            ? "text-4xl"
                            : "text-xl"
                      }`}
                    >
                      {section.title}
                    </motion.h2>
                  </motion.div>

                  <motion.div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors pointer-events-none" />
                </div>
              )}

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 overflow-y-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="min-h-full flex flex-col justify-center">
                      <div className="shrink-0 px-12 py-24">
                        <div className="max-w-lg mx-auto text-white">
                          <h2 className="text-white italic mb-6 text-2xl">
                            {section.title}
                          </h2>

                          {section.content}
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close Triangle Button - positioned relative to tile */}
              <AnimatePresence>
                {isActive && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => handleSectionClick(section.id)}
                    className="absolute w-16 h-16 flex hover:opacity-80 transition-opacity z-20 cursor-pointer
                    bg-white/20"
                    style={{
                      clipPath: isMobile ? "polygon(0 100%, 100% 100%, 0 0)" : getTriangleClipPath(section.id),
                      backdropFilter: "blur(4px)",
                      ...(isMobile ? { bottom: 0, left: 0, justifyContent: "flex-end", alignItems: "flex-end",
                          paddingRight: "53px", paddingBottom: "17px" } :
                        section.id === 1 ? { bottom: 0, right: 0, justifyContent: "flex-start", alignItems:
                            "flex-end", paddingLeft: "53px", paddingBottom: "17px" } :
                        section.id === 2 ? { bottom: 0, left: 0, justifyContent: "flex-end", alignItems: "flex-end",
                            paddingRight: "53px", paddingBottom: "17px" } :
                        section.id === 3 ? { top: 0, right: 0, justifyContent: "flex-start", alignItems:
                            "flex-start", paddingLeft: "53px", paddingTop: "17px" } :
                        { top: 0, left: 0, justifyContent: "flex-end", alignItems: "flex-start", paddingRight:
                            "53px", paddingTop: "17px" }
                      ),
                    }}
                    aria-label="Close section"
                  >
                    {section.id === 1 && <X className="w-4 h-4 text-emerald-800" />}
                    {section.id === 2 && <X className="w-4 h-4 text-slate-900" />}
                    {section.id === 3 && <X className="w-4 h-4 text-amber-700" />}
                    {section.id === 4 && <X className="w-4 h-4 text-blue-900" />}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
