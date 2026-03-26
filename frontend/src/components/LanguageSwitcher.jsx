import React, { useState } from "react";

const languages = [
    { code: "en", name: "English", flag: "https://flagcdn.com/us.svg" },
    { code: "zh-CN", name: "Chinese", flag: "https://flagcdn.com/cn.svg" },
    { code: "ko", name: "Korean", flag: "https://flagcdn.com/kr.svg" },
    { code: "id", name: "Indonesian", flag: "https://flagcdn.com/id.svg" },
    { code: "es", name: "Spanish", flag: "https://flagcdn.com/es.svg" },
    { code: "vi", name: "Vietnamese", flag: "https://flagcdn.com/vn.svg" },
    { code: "bn", name: "Bangla", flag: "https://flagcdn.com/bd.svg" }
];

export default function LanguageSwitcher() {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(languages[0]);

    function changeLanguage(lang) {
        if (lang.code === "en") {
            setCurrent(lang);
            setOpen(false);

            const domain = window.location.hostname;
            const domainParts = domain.split('.');
            const rootDomain = domainParts.slice(-2).join('.');

            // Generate ALL possible domain variations
            const domains = [
                '', // empty = current domain only
                domain,
                `.${domain}`,
                domain.replace(/^www\./, ''), // without www
                `.${domain.replace(/^www\./, '')}`,
                rootDomain,
                `.${rootDomain}`,
                `www.${rootDomain}`,
                `.www.${rootDomain}`
            ];

            // Clear cookies for ALL path variations
            const paths = ['/', '/en/', '/us/', '/home/']; // add your common paths

            // Generate every possible cookie combination
            domains.forEach(domainVar => {
                paths.forEach(path => {
                    // Without secure flag
                    let cookieStr = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
                    if (domainVar) cookieStr += `; domain=${domainVar}`;
                    document.cookie = cookieStr;

                    // With secure flag
                    cookieStr += '; secure';
                    document.cookie = cookieStr;
                });
            });

            // Also try to reset via Google Translate element
            const select = document.querySelector(".goog-te-combo");
            if (select) {
                select.value = "";
                select.dispatchEvent(new Event("change", { bubbles: true }));
            }

            // Remove Google Translate elements
            document.querySelectorAll('.goog-te-banner-frame, .skiptranslate, iframe[src*="translate"]').forEach(el => {
                el.remove();
            });

            // Force reload with cache busting
            setTimeout(() => {
                window.location.href = window.location.href.split('?')[0] + '?reset=' + Date.now();
            }, 200);

            return;
        }

        // For non-English languages (your existing code)
        const attemptChange = (retries = 5) => {
            const select = document.querySelector(".goog-te-combo");
            if (!select) {
                if (retries > 0) setTimeout(() => attemptChange(retries - 1), 300);
                return;
            }
            select.value = lang.code;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        };

        setCurrent(lang);
        setOpen(false);
        attemptChange();
    }

    return (
        <div className="lang-container relative">
            <button
                className="lang-button flex items-center gap-1 px-2 py-1 md:py-1.5 md:px-3 border rounded-md hover:bg-gray-50"
                onClick={() => setOpen(!open)}
            >
                <img
                    src={current.flag}
                    alt={current.name}
                    className="w-7 h-5 object-cover rounded-sm"
                />
                <span className="hidden sm:inline">{current.name}</span>
                <span className="text-xs">▾</span>
            </button>

            {open && (
                <div className="lang-dropdown absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg z-50">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            className="lang-option flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                            onClick={() => changeLanguage(lang)}
                        >
                            <img
                                src={lang.flag}
                                alt={lang.name}
                                className="w-7 h-5 object-cover rounded-sm border"
                                loading="lazy"
                            />
                            <span>{lang.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}