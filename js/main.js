/*
 * MHD Run — marketingový web, hlavní skript
 *
 * Závislosti:
 *   PapaParse 5.4.1 (https://www.papaparse.com/)
 *   — knihovna pro parsování CSV dat v prohlížeči.
 *   — používá se k načtení a zpracování karet (úkoly, prokletí)
 *     z Google Sheets exportovaných jako CSV.
 *   — načtena přes CDN v <head> stránky.
 */


/* ========================================
   I18N SYSTÉM
   ======================================== */

const LOCALE_KEY = 'mhd-site-locale';
let currentLocale = localStorage.getItem(LOCALE_KEY) || 'cs';

const translations = {
    cs: {
        // Navigace
        'nav.home':      'Domů',
        'nav.rules':     'Pravidla',
        'nav.quests':    'Úkoly',
        'nav.howToPlay': 'Jak hrát',

        // Hero
        'hero.subtitle':  'Celoměstská hra na honičku, dopravu a rychlé myšlení. Plňte výzvy, sbírejte mince a unikněte chytačům.',
        'hero.playApp':   'Hrát aplikaci',
        'hero.readRules': 'Číst pravidla',
        'hero.howToPlay': 'Jak hrát',

        // Funkce
        'feature1.title': 'Mince a výzvy',
        'feature1.desc':  'Lízejte karty úkolů a prokletí a vydělávejte mince. Plňte výzvy kdykoli během hry a navyšujte svůj rozpočet.',
        'feature2.title': 'Doprava a strategie',
        'feature2.desc':  'Utrácejte mince v obchodě za čas na MHD — tramvaj, metro, autobus, loď nebo kolo. Plánujte trasu chytře.',
        'feature3.title': 'Honička a únik',
        'feature3.desc':  'Utečníci musí dosáhnout tajného cíle. Chytači je musí vyfotit jako první. Role se po každém kole mění.',

        // Statistiky
        'stat1.label': 'Lokací v Praze',
        'stat2.label': 'Minimálně hráčů',
        'stat3.label': 'Znovuhratelnost',

        // O hře
        'about.title': 'O hře',
        'about.body':  'MHD Run je inspirovaný hrou Jet Lag: The Game a odehrává se na síti pražské hromadné dopravy. Dva týmy se střetnou — jeden se snaží dosáhnout svého tajného cíle, druhý ho chce chytit. Karty, powerupy a omezený čas na MHD dělají každé kolo nepředvídatelným.',

        // Pravidla
        'rules.title':    'Pravidla',
        'rules.subtitle': 'Vše, co potřebuješ vědět před prvním hraním.',

        // Úkoly
        'quests.title':         'Úkoly a Prokletí',
        'quests.subtitle':      'Všechny karty dostupné ve hře — úkoly ke splnění a prokletí, která musíš vydržet.',
        'quests.filter.all':    'Vše',
        'quests.filter.quest':  'Úkoly',
        'quests.filter.curse':  'Prokletí',
        'quests.loading':       'Načítám karty ze spreadsheetu…',
        'quests.error':         'Nepodařilo se načíst karty. Zkontroluj připojení a zkus to znovu.',
        'quests.retry':         'Zkusit znovu',
        'quests.empty':         'Žádné karty k zobrazení.',
        'quests.count.one':     'karta',
        'quests.count.few':     'karty',
        'quests.count.many':    'karet',

        // Jak hrát
        'htp.title':    'Jak hrát',
        'htp.subtitle': 'Průvodce webovou aplikací MHD Run a vším, co potřebuješ k zahájení hry.',
        'htp.tip':      '<strong>💡 Tip:</strong> Aplikace funguje plně offline po načtení dat. Přidej ji na plochu, aby se spouštěla jako nativní aplikace.',

        // Typy karet
        'card.type.quest': 'Úkol',
        'card.type.curse': 'Prokletí',

        // Patička
        'footer.text': 'MHD Run — hra na honičku po pražské hromadné dopravě.',
    },

    en: {
        // Navigation
        'nav.home':      'Home',
        'nav.rules':     'Rules',
        'nav.quests':    'Quests',
        'nav.howToPlay': 'How to Play',

        // Hero
        'hero.subtitle':  'A city-wide game of chase, transit, and quick thinking. Complete challenges, earn coins, and outrun the chasers.',
        'hero.playApp':   'Play the App',
        'hero.readRules': 'Read the Rules',
        'hero.howToPlay': 'How to Play',

        // Features
        'feature1.title': 'Coins &amp; Challenges',
        'feature1.desc':  'Draw quest and curse cards to earn coins. Complete challenges at any time during your run to grow your budget.',
        'feature2.title': 'Transit &amp; Strategy',
        'feature2.desc':  'Spend coins in the shop to unlock transit time — tram, metro, bus, boat, or bike. Plan your route wisely.',
        'feature3.title': 'Chase &amp; Escape',
        'feature3.desc':  'The Runners must reach a secret destination. The Chasers must photograph them first. Roles swap each round.',

        // Stats
        'stat1.label': 'Locations in Prague',
        'stat2.label': 'Players needed',
        'stat3.label': 'Replayability',

        // About
        'about.title': 'About the Game',
        'about.body':  'MHD Run is inspired by Jet Lag: The Game and takes place on the public transport network of Prague. Two teams face off — one trying to reach their secret destination, the other trying to catch them first. Cards, power-ups, and limited transit time keep every round unpredictable.',

        // Rules
        'rules.title':    'Rules',
        'rules.subtitle': 'Everything you need to know before your first run.',

        // Quests
        'quests.title':         'Quests &amp; Curses',
        'quests.subtitle':      'All cards available in the game — tasks to complete and curses to endure.',
        'quests.filter.all':    'All',
        'quests.filter.quest':  'Quests',
        'quests.filter.curse':  'Curses',
        'quests.loading':       'Loading cards from spreadsheet…',
        'quests.error':         'Failed to load cards. Check your connection and try refreshing.',
        'quests.retry':         'Retry',
        'quests.empty':         'No cards found.',
        'quests.count.one':     'card',
        'quests.count.few':     'cards',
        'quests.count.many':    'cards',

        // How to play
        'htp.title':    'How to Play',
        'htp.subtitle': 'A guide to the MHD Run web app and everything you need to get started.',
        'htp.tip':      '<strong>💡 Tip:</strong> The app works fully offline once data is fetched. Add it to your home screen so it launches like a native app.',

        // Card type labels
        'card.type.quest': 'Quest',
        'card.type.curse': 'Curse',

        // Footer
        'footer.text': 'MHD Run — a city chase game built on Prague\'s public transport.',
    },
};

function t(key) {
    return translations[currentLocale][key] ?? translations.en[key] ?? key;
}

function applyTranslations() {
    document.documentElement.lang = currentLocale;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerHTML = t(el.dataset.i18n);
    });

    document.querySelectorAll('[data-lang-block]').forEach(el => {
        el.hidden = el.dataset.langBlock !== currentLocale;
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLocale);
    });

    if (allCards.length > 0) renderCards();
}

function setLanguage(locale) {
    if (locale === currentLocale) return;
    currentLocale = locale;
    localStorage.setItem(LOCALE_KEY, locale);
    applyTranslations();
    loadQuests();
}


/* ========================================
   NAVIGACE
   ======================================== */

const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu   = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', !isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.setAttribute('aria-hidden', String(isOpen));
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    });
});

// Zvýraznění aktivní sekce při scrollu
const sectionIds = ['home', 'rules', 'quests', 'how-to-play'];

function updateActiveNav() {
    const scrollY = window.scrollY + 80;
    let active = sectionIds[0];
    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) active = id;
    });
    document.querySelectorAll('[data-section]').forEach(link => {
        link.classList.toggle('active', link.dataset.section === active);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


/* ========================================
   ÚKOLY — NAČTENÍ CSV A VYKRESLENÍ
   ======================================== */

const CSV_URLS = {
    cs: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRINMC6eKg8bWyZW9H-aZ9RTsqTMJgZSkVIS60ogExiBZ6I0NsI2C36vSP2Hgw-_qJYPr2OMWWA7ETB/pub?gid=0&single=true&output=csv',
    en: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRINMC6eKg8bWyZW9H-aZ9RTsqTMJgZSkVIS60ogExiBZ6I0NsI2C36vSP2Hgw-_qJYPr2OMWWA7ETB/pub?gid=460722975&single=true&output=csv',
};

let allCards      = [];
let currentFilter = 'all';

function isCurse(card) {
    const type = (card.type || '').trim();
    return type === 'Prokletí' || type.toLowerCase() === 'curse';
}

async function loadQuests() {
    const loadingEl = document.getElementById('cards-loading');
    const errorEl   = document.getElementById('cards-error');
    const gridEl    = document.getElementById('cards-grid');

    loadingEl.style.display = 'block';
    errorEl.hidden          = true;
    gridEl.innerHTML        = '';
    document.getElementById('cards-count').textContent = '';

    try {
        const response = await fetch(CSV_URLS[currentLocale]);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();

        // PapaParse: převod CSV textu na pole objektů s hlavičkami
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        if (result.errors.length > 0) throw new Error(result.errors[0].message);

        allCards = result.data;
        loadingEl.style.display = 'none';
        renderCards();
    } catch (err) {
        console.error('Failed to load quests:', err);
        loadingEl.style.display = 'none';
        errorEl.hidden          = false;
    }
}

function setFilter(filter, btnEl) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    btnEl.classList.add('active');
    btnEl.setAttribute('aria-selected', 'true');
    renderCards();
}

function cardCount(n) {
    if (currentLocale === 'cs') {
        if (n === 1) return `1 ${t('quests.count.one')}`;
        if (n >= 2 && n <= 4) return `${n} ${t('quests.count.few')}`;
        return `${n} ${t('quests.count.many')}`;
    }
    return `${n} ${n === 1 ? t('quests.count.one') : t('quests.count.many')}`;
}

function renderCards() {
    const gridEl  = document.getElementById('cards-grid');
    const countEl = document.getElementById('cards-count');

    const filtered = allCards.filter(card => {
        if (currentFilter === 'quest') return !isCurse(card);
        if (currentFilter === 'curse') return  isCurse(card);
        return true;
    });

    countEl.textContent = filtered.length > 0 ? cardCount(filtered.length) : '';

    if (filtered.length === 0) {
        gridEl.innerHTML = `<p class="cards-empty">${t('quests.empty')}</p>`;
        return;
    }

    gridEl.innerHTML = filtered.map(createCardHTML).join('');
}

function escapeHTML(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}

function createCardHTML(card) {
    const curse  = isCurse(card);
    const coins  = parseInt(card.rewardCoins)   || 0;
    const gems   = parseInt(card.rewardPowerUp) || 0;
    const timer  = parseInt(card.timer)          || 0;

    const typeClass = curse ? 'type-label-curse' : 'type-label-quest';
    const typeText  = curse ? t('card.type.curse') : t('card.type.quest');

    const coinSVG  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>`;
    const gemSVG   = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`;
    const timerSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4"/><path d="M12 14v-4"/><circle cx="12" cy="14" r="8"/></svg>`;

    let badges = '';
    if (coins > 0) badges += `<span class="badge badge-coin">${coinSVG}${coins}</span>`;
    if (gems  > 0) badges += `<span class="badge badge-gem">${gemSVG}${gems}</span>`;
    if (timer > 0) badges += `<span class="badge badge-timer">${timerSVG}${timer}m</span>`;

    return `
<div class="playing-card${curse ? ' curse-glow' : ''}">
    <div class="playing-card-header">
        <div class="playing-card-meta">
            <h3 class="playing-card-title">${escapeHTML(card.title)}</h3>
            <span class="type-label ${typeClass}">${typeText}</span>
        </div>
        <p class="playing-card-description">${escapeHTML(card.description)}</p>
    </div>
    ${badges ? `<div class="playing-card-footer">${badges}</div>` : ''}
</div>`;
}


/* ========================================
   INICIALIZACE
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Přepínač jazyka
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // Filtry karet
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter, btn));
    });

    // Retry tlačítko
    document.getElementById('cards-error-retry')?.addEventListener('click', loadQuests);

    applyTranslations();
    loadQuests();
});
