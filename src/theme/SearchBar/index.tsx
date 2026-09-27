import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useHistory} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import MiniSearch, {type SearchResult} from 'minisearch';
import styles from './styles.module.css';

interface SearchDoc {
  id: number;
  title: string;
  section: string;
  content: string;
  url: string;
}

type Hit = SearchResult & SearchDoc;

const MAX_RESULTS = 12;
const MIN_QUERY_LENGTH = 2;

export default function SearchBar(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hit[]>([]);
  const [selected, setSelected] = useState(0);
  const [indexState, setIndexState] = useState<
    'idle' | 'loading' | 'ready' | 'missing'
  >('idle');
  const indexRef = useRef<MiniSearch<SearchDoc> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();
  const {siteConfig} = useDocusaurusContext();
  const searchIndexUrl = useBaseUrl('/search-index.json');

  const search = useCallback((text: string) => {
    if (!indexRef.current || text.length < MIN_QUERY_LENGTH) {
      setResults([]);
    } else {
      setResults(indexRef.current.search(text).slice(0, MAX_RESULTS) as Hit[]);
    }
    setSelected(0);
  }, []);

  useEffect(() => {
    if (!isOpen || indexState !== 'idle') return;

    setIndexState('loading');
    fetch(searchIndexUrl)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((docs: SearchDoc[]) => {
        const ms = new MiniSearch<SearchDoc>({
          fields: ['title', 'section', 'content'],
          storeFields: ['title', 'section', 'content', 'url'],
          searchOptions: {
            boost: {title: 3, section: 2},
            prefix: true,
            fuzzy: 0.2,
          },
        });
        ms.addAll(docs);
        indexRef.current = ms;
        setIndexState('ready');
      })
      .catch(() => setIndexState('missing'));
  }, [isOpen, indexState, searchIndexUrl]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery('');
      setResults([]);
      setSelected(0);
    }
  }, [isOpen]);

  useEffect(() => {
    search(query);
  }, [query, indexState, search]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const navigate = useCallback(
    (url: string) => {
      setIsOpen(false);
      history.push(siteConfig.baseUrl + url.replace(/^\//, ''));
    },
    [history, siteConfig.baseUrl],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelected((s) => Math.min(s + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelected((s) => Math.max(s - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selected]) navigate(results[selected].url);
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [results, selected, navigate],
  );

  useEffect(() => {
    document
      .querySelector(`.${styles.result}[data-selected="true"]`)
      ?.scrollIntoView({block: 'nearest'});
  }, [selected]);

  const matchedTerms = getMatchedTerms(results);

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label="Hľadať"
        type="button">
        <SearchIcon />
        <span className={styles.triggerLabel}>Hľadať</span>
        <kbd className={styles.kbd}>⌘K</kbd>
      </button>

      {isOpen &&
        createPortal(
          <div className={styles.overlay} onMouseDown={() => setIsOpen(false)}>
            <div
              className={styles.modal}
              onMouseDown={(e) => e.stopPropagation()}>
              <div className={styles.inputRow}>
                <SearchIcon />
                <input
                  ref={inputRef}
                  className={styles.input}
                  type="text"
                  placeholder="Hľadať na stránke…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <kbd className={styles.kbdEsc}>Esc</kbd>
              </div>

              {results.length > 0 && (
                <ul className={styles.resultsList}>
                  {results.map((r, i) => (
                    <li
                      key={r.id}
                      className={styles.result}
                      data-selected={i === selected}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => navigate(r.url)}>
                      <div className={styles.resultTitle}>
                        <Highlight text={r.title} terms={matchedTerms} />
                        {r.section && (
                          <span className={styles.resultSection}>
                            ›{' '}
                            <Highlight text={r.section} terms={matchedTerms} />
                          </span>
                        )}
                      </div>
                      <div className={styles.resultSnippet}>
                        <Highlight
                          text={getSnippet(r.content, Object.keys(r.match))}
                          terms={matchedTerms}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {indexState === 'missing' && (
                <div className={styles.noResults}>
                  Vyhľadávací index je dostupný až po zostavení (
                  <code>yarn build</code>).
                </div>
              )}

              {indexState === 'ready' &&
                query.length >= MIN_QUERY_LENGTH &&
                results.length === 0 && (
                  <div className={styles.noResults}>
                    Žiadne výsledky pre &ldquo;{query}&rdquo;
                  </div>
                )}

              <div className={styles.footer}>
                <span>
                  <kbd className={styles.kbdSmall}>↑</kbd>
                  <kbd className={styles.kbdSmall}>↓</kbd> pohyb
                </span>
                <span>
                  <kbd className={styles.kbdSmall}>↵</kbd> otvoriť
                </span>
                <span>
                  <kbd className={styles.kbdSmall}>esc</kbd> zavrieť
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function getMatchedTerms(results: SearchResult[]): string[] {
  const terms = new Set<string>();
  for (const r of results) {
    for (const term of Object.keys(r.match)) {
      terms.add(term);
    }
  }
  return Array.from(terms);
}

function getSnippet(
  content: string,
  terms: string[],
  contextChars = 140,
): string {
  const lower = content.toLowerCase();
  const pos = terms
    .map((term) => lower.indexOf(term.toLowerCase()))
    .filter((p) => p !== -1)
    .sort((a, b) => a - b)[0];

  if (pos === undefined) {
    return (
      content.slice(0, contextChars) +
      (content.length > contextChars ? '…' : '')
    );
  }
  const start = Math.max(0, pos - contextChars / 2);
  const end = Math.min(content.length, pos + contextChars / 2);
  return (
    (start > 0 ? '…' : '') +
    content.slice(start, end) +
    (end < content.length ? '…' : '')
  );
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Highlight({
  text,
  terms,
}: {
  text: string;
  terms: string[];
}): React.ReactElement {
  if (!terms.length || !text) return <>{text}</>;
  const pattern = new RegExp(`(${terms.map(escapeRegex).join('|')})`, 'gi');
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className={styles.mark}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function SearchIcon(): React.ReactElement {
  return (
    <svg
      className={styles.searchIcon}
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none">
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke="currentColor"
        strokeWidth="1.66"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
