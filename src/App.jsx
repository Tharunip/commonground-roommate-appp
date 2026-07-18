
import React, { useMemo, useState } from "react";

const scenarios = [
  {
    id: "guests",
    category: "Guests",
    title: "Friends before an important day",
    prompt: "Your roommate wants to host friends the night before your job interview. What would you expect?",
    options: [
      "Guests are fine without notice",
      "Give me a few hours' notice",
      "Ask me before inviting them",
      "No guests that night"
    ]
  },
  {
    id: "overnight",
    category: "Safety",
    title: "Overnight partners",
    prompt: "How often are overnight guests acceptable?",
    options: [
      "Anytime",
      "Two or three nights per week",
      "Once per week",
      "Only with prior agreement",
      "Never"
    ]
  },
  {
    id: "cleaning",
    category: "Chores",
    title: "Dishes in the sink",
    prompt: "Dishes have been left in the sink overnight. When does this become a problem?",
    options: [
      "Immediately",
      "By the next morning",
      "After 24 hours",
      "After several days"
    ]
  },
  {
    id: "noise",
    category: "Noise",
    title: "Late-night calls",
    prompt: "Your roommate is on a work call after 11 PM. What is acceptable?",
    options: [
      "Totally fine",
      "Fine with headphones",
      "Only in their bedroom",
      "Not acceptable on weekdays"
    ]
  },
  {
    id: "food",
    category: "Shared space",
    title: "Shared groceries",
    prompt: "Your roommate uses some of your groceries. What should happen?",
    options: [
      "Sharing is expected",
      "Ask first",
      "Replace it afterward",
      "Never use my food"
    ]
  },
  {
    id: "access",
    category: "Safety",
    title: "Apartment access",
    prompt: "Can a roommate give the apartment access code to a partner or close friend?",
    options: [
      "Yes",
      "Only after informing the roommate",
      "Only if both roommates approve",
      "Never"
    ]
  },
  {
    id: "expenses",
    category: "Finances",
    title: "Shared household expenses",
    prompt: "How should shared household items be handled?",
    options: [
      "Split everything equally",
      "Track each purchase",
      "Alternate purchases",
      "Agree on a monthly shared budget"
    ]
  },
  {
    id: "conflict",
    category: "Communication",
    title: "Handling conflict",
    prompt: "When something bothers you, how should it be handled?",
    options: [
      "Discuss it immediately",
      "Send a message first",
      "Have a weekly roommate check-in",
      "Wait unless it becomes serious"
    ]
  }
];

const defaultAnswers = {
  a: {
    guests: 2,
    overnight: 3,
    cleaning: 1,
    noise: 2,
    food: 1,
    access: 2,
    expenses: 3,
    conflict: 1
  },
  b: {
    guests: 1,
    overnight: 2,
    cleaning: 2,
    noise: 1,
    food: 1,
    access: 1,
    expenses: 0,
    conflict: 1
  }
};

const defaultAgreementTerms = [
  {
    id: "quiet-hours",
    category: "Noise",
    title: "Quiet hours",
    text: "Quiet hours are from 10 PM to 7 AM on weekdays.",
    source: "default",
    status: "agreed"
  },
  {
    id: "dishes",
    category: "Chores",
    title: "Dishes",
    text: "Dishes should be cleaned before the next morning.",
    source: "default",
    status: "agreed"
  },
  {
    id: "food",
    category: "Shared space",
    title: "Groceries",
    text: "Groceries are private unless permission is given.",
    source: "default",
    status: "agreed"
  },
  {
    id: "utilities",
    category: "Finances",
    title: "Utilities",
    text: "Utilities are split equally and settled by the fifth of each month.",
    source: "default",
    status: "agreed"
  }
];

const defaultChores = [
  { id: 1, title: "Take out trash", owner: "Maya", due: "Tuesday", done: true },
  { id: 2, title: "Clean kitchen", owner: "Tara", due: "Wednesday", done: false },
  { id: 3, title: "Clean bathroom", owner: "Maya", due: "Thursday", done: false }
];

const pastIssues = [
  {
    id: 1,
    category: "overnight",
    description: "Overnight guest stayed longer than agreed.",
    status: "resolved",
    createdAt: "Jul 3"
  },
  {
    id: 2,
    category: "overnight",
    description: "Guest notice was sent after arrival.",
    status: "resolved",
    createdAt: "Jul 10"
  }
];

function severityFor(a, b, id) {
  const difference = Math.abs(a - b);
  if (id === "access" && difference >= 1) return "major";
  if (id === "overnight" && difference >= 2) return "major";
  if (difference <= 1) return "aligned";
  if (difference === 2) return "discussion";
  return "major";
}

function severityLabel(value) {
  if (value === "aligned") return "Aligned";
  if (value === "discussion") return "Needs discussion";
  return "Major difference";
}

function buildCompromises(topic, answerA, answerB) {
  const lower = topic.toLowerCase();

  if (lower.includes("overnight")) {
    return [
      "Overnight guests are allowed once per week with at least 12 hours' notice.",
      "Overnight guests are limited to two nights per month and require mutual approval.",
      "A recurring partner may stay once per week; all other overnight guests require approval."
    ];
  }

  if (lower.includes("access")) {
    return [
      "Door codes and keys may not be shared without both roommates approving.",
      "One recurring guest may be approved by both roommates, but may not enter while the inviting roommate is away.",
      "Temporary access is allowed only for emergencies and must be disclosed immediately."
    ];
  }

  if (lower.includes("guest")) {
    return [
      "Daytime guests require four hours' notice; overnight guests require 12 hours' notice.",
      "Spontaneous daytime guests are allowed before 8 PM, but overnight guests require approval.",
      "Each roommate may host two spontaneous visits per month; all others require advance notice."
    ];
  }

  if (lower.includes("dish") || lower.includes("clean")) {
    return [
      "Dishes must be rinsed immediately and fully cleaned before 10 AM the next day.",
      "Each roommate gets one designated side of the sink and must clear it within 24 hours.",
      "Use a rotating kitchen reset schedule three times per week."
    ];
  }

  if (lower.includes("noise")) {
    return [
      "Headphones are required after 10 PM and calls must happen in bedrooms.",
      "Quiet hours begin at 11 PM on weekends and 10 PM on weekdays.",
      "Late calls are allowed with advance notice and closed doors."
    ];
  }

  if (lower.includes("expense")) {
    return [
      "Create a $50 monthly shared household budget and split it equally.",
      "Track purchases and settle the balance at the end of each month.",
      "Alternate responsibility for common household supplies."
    ];
  }

  return [
    `Use a one-month trial based on ${answerA.toLowerCase()}, then review together.`,
    `Choose a middle-ground rule and revisit it after two weeks.`,
    `Keep the stricter boundary by default, with exceptions only when both roommates agree.`
  ];
}

function toneMessages(term, issueDescription) {
  const title = term?.title || "household agreement";
  const text = term?.text || "the expectation you both discussed";

  return {
    gentle: `Hey, just a reminder about our ${title.toLowerCase()}. We agreed that ${text.charAt(0).toLowerCase() + text.slice(1)} Could we check in about what happened?`,
    direct: `Our shared agreement says: "${text}" The current situation may not match that agreement, so we should address it.`,
    collaborative: `It looks like our current situation may no longer match what we agreed about ${title.toLowerCase()}. Should we keep the original rule or update it together?`
  };
}

function Button({ children, variant = "primary", onClick, disabled = false, type = "button" }) {
  return (
    <button
      className={`button button-${variant}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

function Pill({ children, tone = "neutral" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="section-header">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("home");
  const [roommates, setRoommates] = useState({ a: "Tara", b: "Maya" });
  const [activeRoommate, setActiveRoommate] = useState("a");
  const [answers, setAnswers] = useState(defaultAnswers);
  const [negotiations, setNegotiations] = useState({});
  const [agreementVersion, setAgreementVersion] = useState(1);
  const [agreementTerms, setAgreementTerms] = useState(defaultAgreementTerms);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [chores, setChores] = useState(defaultChores);
  const [issues, setIssues] = useState(pastIssues);
  const [issueDraft, setIssueDraft] = useState({ category: "overnight", description: "" });
  const [selectedTone, setSelectedTone] = useState("gentle");
  const [sentNudge, setSentNudge] = useState(null);
  const [guestForm, setGuestForm] = useState({
    type: "Friend",
    arrival: "Today, 7:00 PM",
    departure: "Today, 10:00 PM",
    overnight: false
  });
  const [guestUpdates, setGuestUpdates] = useState([]);

  const comparisons = useMemo(() => {
    return scenarios.map((scenario) => {
      const a = answers.a[scenario.id];
      const b = answers.b[scenario.id];
      const severity = severityFor(a, b, scenario.id);
      return {
        ...scenario,
        answerAIndex: a,
        answerBIndex: b,
        answerAText: scenario.options[a],
        answerBText: scenario.options[b],
        severity
      };
    });
  }, [answers]);

  const counts = useMemo(() => {
    return comparisons.reduce(
      (acc, item) => {
        acc[item.severity] += 1;
        return acc;
      },
      { aligned: 0, discussion: 0, major: 0 }
    );
  }, [comparisons]);

  const compatibility = Math.max(
    40,
    Math.round(((counts.aligned + counts.discussion * 0.55) / comparisons.length) * 100)
  );

  const conflictItems = comparisons.filter((item) => item.severity !== "aligned");

  const agreementFromNegotiations = Object.values(negotiations)
    .filter((item) => item.acceptedOption)
    .map((item) => ({
      id: `negotiated-${item.id}`,
      category: item.category,
      title: item.title,
      text: item.acceptedOption,
      source: "negotiated",
      status: "agreed"
    }));

  const fullAgreement = [
    ...defaultAgreementTerms.filter(
      (term) => !agreementFromNegotiations.some((newTerm) => newTerm.title === term.title)
    ),
    ...agreementFromNegotiations
  ];

  const activeIssueTerm = useMemo(() => {
    const categoryMap = {
      overnight: ["overnight", "guest"],
      guests: ["guest"],
      chores: ["dish", "clean", "chore"],
      noise: ["quiet", "noise"],
      privacy: ["access", "key", "privacy"],
      expenses: ["utilities", "expense", "budget"]
    };

    const keywords = categoryMap[issueDraft.category] || [issueDraft.category];

    return fullAgreement.find((term) =>
      keywords.some(
        (word) =>
          term.title.toLowerCase().includes(word) ||
          term.text.toLowerCase().includes(word)
      )
    );
  }, [issueDraft.category, fullAgreement]);

  const recurringCount =
    issues.filter((issue) => issue.category === issueDraft.category).length + 1;

  const nudgeOptions = toneMessages(activeIssueTerm, issueDraft.description);

  function updateAnswer(roommate, scenarioId, optionIndex) {
    setAnswers((current) => ({
      ...current,
      [roommate]: {
        ...current[roommate],
        [scenarioId]: optionIndex
      }
    }));
  }

  function initializeNegotiation(item) {
    setNegotiations((current) => ({
      ...current,
      [item.id]:
        current[item.id] || {
          id: item.id,
          category: item.category,
          title: item.title,
          answerA: item.answerAText,
          answerB: item.answerBText,
          options: buildCompromises(item.title, item.answerAText, item.answerBText),
          acceptedOption: null
        }
    }));
  }

  function acceptNegotiation(item, option) {
    setNegotiations((current) => ({
      ...current,
      [item.id]: {
        ...(current[item.id] || {
          id: item.id,
          category: item.category,
          title: item.title,
          answerA: item.answerAText,
          answerB: item.answerBText,
          options: buildCompromises(item.title, item.answerAText, item.answerBText)
        }),
        acceptedOption: option
      }
    }));
  }

  function finalizeAgreement() {
    setAgreementTerms(fullAgreement);
    setAgreementAccepted(true);
    setScreen("agreement");
  }

  function toggleChore(id) {
    setChores((current) =>
      current.map((chore) =>
        chore.id === id ? { ...chore, done: !chore.done } : chore
      )
    );
  }

  function submitIssue() {
    if (!issueDraft.description.trim()) return;

    const issue = {
      id: Date.now(),
      category: issueDraft.category,
      description: issueDraft.description.trim(),
      status: "open",
      createdAt: "Today",
      agreementTermId: activeIssueTerm?.id || null
    };

    setIssues((current) => [...current, issue]);
    setScreen("nudge");
  }

  function sendNudge() {
    setSentNudge({
      tone: selectedTone,
      text: nudgeOptions[selectedTone],
      sentAt: "Just now"
    });
    setScreen("response");
  }

  function resolveIssue(action) {
    setIssues((current) =>
      current.map((issue, index) =>
        index === current.length - 1
          ? {
              ...issue,
              status: action === "renegotiate" ? "renegotiating" : "resolved"
            }
          : issue
      )
    );

    if (action === "renegotiate" && activeIssueTerm) {
      setAgreementVersion((version) => version + 1);
      setAgreementTerms((terms) =>
        terms.map((term) =>
          term.id === activeIssueTerm.id
            ? {
                ...term,
                text:
                  term.category === "Safety"
                    ? "Overnight guests require 24 hours' notice and approval for stays longer than one night."
                    : `${term.text} This term was reviewed after a household check-in.`
              }
            : term
        )
      );
    }

    setScreen("dashboard");
  }

  function addGuestUpdate() {
    const followsAgreement = !guestForm.overnight;
    setGuestUpdates((current) => [
      ...current,
      {
        id: Date.now(),
        ...guestForm,
        status: followsAgreement ? "notified" : "approval requested"
      }
    ]);
    setScreen("dashboard");
  }

  function resetDemo() {
    setScreen("home");
    setActiveRoommate("a");
    setAnswers(defaultAnswers);
    setNegotiations({});
    setAgreementVersion(1);
    setAgreementTerms(defaultAgreementTerms);
    setAgreementAccepted(false);
    setChores(defaultChores);
    setIssues(pastIssues);
    setIssueDraft({ category: "overnight", description: "" });
    setSelectedTone("gentle");
    setSentNudge(null);
    setGuestUpdates([]);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("home")}>
          <span className="brand-mark">C</span>
          <span>CommonGround</span>
        </button>
        <div className="topbar-actions">
          {agreementAccepted && (
            <Pill tone="success">Agreement v{agreementVersion}</Pill>
          )}
          <button className="text-button" onClick={resetDemo}>
            Reset demo
          </button>
        </div>
      </header>

      <main className="page">
        {screen === "home" && (
          <section className="hero">
            <div className="hero-copy">
              <Pill tone="accent">Roommate relationship management</Pill>
              <h1>
                Agree on how you will live together before the problems begin.
              </h1>
              <p>
                Compare real-life scenarios, negotiate boundaries, generate a
                shared agreement, and use that agreement later when conflicts
                happen.
              </p>
              <div className="hero-actions">
                <Button onClick={() => setScreen("setup")}>
                  Start demo
                </Button>
                <Button variant="secondary" onClick={() => setScreen("dashboard")}>
                  View post-move dashboard
                </Button>
              </div>
              <div className="feature-strip">
                <div>
                  <strong>1</strong>
                  <span>Scenario compatibility</span>
                </div>
                <div>
                  <strong>2</strong>
                  <span>Negotiation + agreement</span>
                </div>
                <div>
                  <strong>3</strong>
                  <span>Agreement-powered support</span>
                </div>
              </div>
            </div>
            <div className="hero-card">
              <div className="mock-window">
                <div className="mock-window-bar">
                  <span></span><span></span><span></span>
                </div>
                <div className="mock-content">
                  <Pill tone="warning">Needs discussion</Pill>
                  <h3>Overnight guests</h3>
                  <div className="comparison-row">
                    <div>
                      <small>Tara</small>
                      <p>Only with prior agreement</p>
                    </div>
                    <div>
                      <small>Maya</small>
                      <p>Once per week is fine</p>
                    </div>
                  </div>
                  <div className="accepted-card">
                    <small>Accepted compromise</small>
                    <p>
                      Once per week with at least 12 hours' notice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {screen === "setup" && (
          <section className="narrow">
            <SectionHeader
              eyebrow="Step 1"
              title="Create your roommate space"
              subtitle="For this demo, you can switch between both roommates without authentication."
            />

            <div className="card form-card">
              <label>
                Roommate A
                <input
                  value={roommates.a}
                  onChange={(event) =>
                    setRoommates((current) => ({
                      ...current,
                      a: event.target.value
                    }))
                  }
                />
              </label>
              <label>
                Roommate B
                <input
                  value={roommates.b}
                  onChange={(event) =>
                    setRoommates((current) => ({
                      ...current,
                      b: event.target.value
                    }))
                  }
                />
              </label>
              <div className="invite-preview">
                <span>Shared space</span>
                <strong>{roommates.a} + {roommates.b}</strong>
                <code>commonground.app/invite/CG-4821</code>
              </div>
              <Button onClick={() => setScreen("scenarios")}>
                Start compatibility check
              </Button>
            </div>
          </section>
        )}

        {screen === "scenarios" && (
          <section>
            <SectionHeader
              eyebrow="Feature 1"
              title="Scenario-based compatibility"
              subtitle="Switch between roommates and answer the same real-life situations privately."
            />

            <div className="persona-switch">
              <button
                className={activeRoommate === "a" ? "active" : ""}
                onClick={() => setActiveRoommate("a")}
              >
                {roommates.a}
              </button>
              <button
                className={activeRoommate === "b" ? "active" : ""}
                onClick={() => setActiveRoommate("b")}
              >
                {roommates.b}
              </button>
            </div>

            <div className="scenario-grid">
              {scenarios.map((scenario, index) => (
                <article className="card scenario-card" key={scenario.id}>
                  <div className="scenario-top">
                    <Pill>{scenario.category}</Pill>
                    <span>{index + 1} / {scenarios.length}</span>
                  </div>
                  <h3>{scenario.title}</h3>
                  <p>{scenario.prompt}</p>
                  <div className="option-list">
                    {scenario.options.map((option, optionIndex) => (
                      <button
                        key={option}
                        className={
                          answers[activeRoommate][scenario.id] === optionIndex
                            ? "option selected"
                            : "option"
                        }
                        onClick={() =>
                          updateAnswer(activeRoommate, scenario.id, optionIndex)
                        }
                      >
                        <span className="radio-dot"></span>
                        {option}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="sticky-actions">
              <div>
                Editing answers for <strong>{roommates[activeRoommate]}</strong>
              </div>
              <Button onClick={() => setScreen("results")}>
                Compare responses
              </Button>
            </div>
          </section>
        )}

        {screen === "results" && (
          <section>
            <SectionHeader
              eyebrow="Compatibility result"
              title={`${roommates.a} and ${roommates.b}: ${compatibility}% compatible`}
              subtitle="The useful part is not the score. It is knowing exactly what needs a conversation."
            />

            <div className="metric-grid">
              <div className="metric-card">
                <span>Aligned</span>
                <strong>{counts.aligned}</strong>
              </div>
              <div className="metric-card">
                <span>Needs discussion</span>
                <strong>{counts.discussion}</strong>
              </div>
              <div className="metric-card">
                <span>Major differences</span>
                <strong>{counts.major}</strong>
              </div>
            </div>

            <div className="result-list">
              {comparisons.map((item) => (
                <article className="card result-card" key={item.id}>
                  <div className="result-heading">
                    <div>
                      <Pill
                        tone={
                          item.severity === "aligned"
                            ? "success"
                            : item.severity === "discussion"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {severityLabel(item.severity)}
                      </Pill>
                      <h3>{item.title}</h3>
                    </div>
                    <span className="category-label">{item.category}</span>
                  </div>
                  <div className="comparison-row">
                    <div>
                      <small>{roommates.a}</small>
                      <p>{item.answerAText}</p>
                    </div>
                    <div>
                      <small>{roommates.b}</small>
                      <p>{item.answerBText}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="sticky-actions">
              <Button variant="secondary" onClick={() => setScreen("scenarios")}>
                Edit answers
              </Button>
              <Button
                onClick={() => {
                  conflictItems.forEach(initializeNegotiation);
                  setScreen("negotiate");
                }}
              >
                Negotiate expectations
              </Button>
            </div>
          </section>
        )}

        {screen === "negotiate" && (
          <section>
            <SectionHeader
              eyebrow="Feature 2"
              title="Negotiate boundaries and expectations"
              subtitle="The app proposes concrete middle-ground options. The roommates decide what to accept."
            />

            <div className="negotiation-list">
              {conflictItems.map((item) => {
                const negotiation =
                  negotiations[item.id] || {
                    options: buildCompromises(
                      item.title,
                      item.answerAText,
                      item.answerBText
                    ),
                    acceptedOption: null
                  };

                return (
                  <article className="card negotiation-card" key={item.id}>
                    <div className="result-heading">
                      <div>
                        <Pill
                          tone={negotiation.acceptedOption ? "success" : "warning"}
                        >
                          {negotiation.acceptedOption ? "Agreed" : "Unresolved"}
                        </Pill>
                        <h3>{item.title}</h3>
                      </div>
                      <span className="category-label">{item.category}</span>
                    </div>

                    <div className="comparison-row">
                      <div>
                        <small>{roommates.a}</small>
                        <p>{item.answerAText}</p>
                      </div>
                      <div>
                        <small>{roommates.b}</small>
                        <p>{item.answerBText}</p>
                      </div>
                    </div>

                    <div className="ai-label">
                      <span>AI-generated compromise options</span>
                      <small>Choose one on behalf of both roommates for the demo.</small>
                    </div>

                    <div className="compromise-list">
                      {negotiation.options.map((option, index) => (
                        <button
                          key={option}
                          className={
                            negotiation.acceptedOption === option
                              ? "compromise selected"
                              : "compromise"
                          }
                          onClick={() => acceptNegotiation(item, option)}
                        >
                          <span>{index + 1}</span>
                          <p>{option}</p>
                          <strong>
                            {negotiation.acceptedOption === option
                              ? "Accepted by both"
                              : "Select"}
                          </strong>
                        </button>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="sticky-actions">
              <div>
                {
                  Object.values(negotiations).filter((item) => item.acceptedOption)
                    .length
                }{" "}
                of {conflictItems.length} conflicts resolved
              </div>
              <Button
                onClick={finalizeAgreement}
                disabled={
                  Object.values(negotiations).filter((item) => item.acceptedOption)
                    .length === 0
                }
              >
                Generate shared agreement
              </Button>
            </div>
          </section>
        )}

        {screen === "agreement" && (
          <section className="narrow-wide">
            <SectionHeader
              eyebrow="Shared roommate agreement"
              title={`${roommates.a} + ${roommates.b}`}
              subtitle="A plain-language decision record created from mutually accepted terms."
            />

            <div className="agreement-paper">
              <div className="agreement-header">
                <div>
                  <Pill tone="success">Version {agreementVersion}</Pill>
                  <h2>Shared Home Agreement</h2>
                  <p>Effective before move-in</p>
                </div>
                <div className="signature-mini">
                  <span>{roommates.a}</span>
                  <span>{roommates.b}</span>
                </div>
              </div>

              {["Finances", "Chores", "Noise", "Shared space", "Guests", "Safety"].map(
                (category) => {
                  const terms = agreementTerms.filter(
                    (term) => term.category === category
                  );
                  if (!terms.length) return null;

                  return (
                    <div className="agreement-section" key={category}>
                      <h3>{category}</h3>
                      {terms.map((term) => (
                        <div className="agreement-term" key={term.id}>
                          <span className="check">✓</span>
                          <div>
                            <strong>{term.title}</strong>
                            <p>{term.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
              )}

              <div className="agreement-note">
                This prototype is a shared household agreement, not a lease or
                legal advice.
              </div>
            </div>

            <div className="button-row center">
              <Button variant="secondary" onClick={() => window.print()}>
                Print agreement
              </Button>
              <Button
                onClick={() => {
                  setAgreementAccepted(true);
                  setScreen("dashboard");
                }}
              >
                Accept and move in
              </Button>
            </div>
          </section>
        )}

        {screen === "dashboard" && (
          <section>
            <SectionHeader
              eyebrow="Feature 3"
              title="Agreement-powered roommate support"
              subtitle="The app acts as a neutral mediation layer after move-in."
            />

            <div className="dashboard-grid">
              <div className="dashboard-main">
                <div className="card dashboard-welcome">
                  <div>
                    <Pill tone="accent">Shared home</Pill>
                    <h2>{roommates.a} + {roommates.b}</h2>
                    <p>
                      Agreement version {agreementVersion} is active.
                    </p>
                  </div>
                  <div className="button-column">
                    <Button onClick={() => setScreen("report")}>
                      Something's bothering me
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setScreen("guest")}
                    >
                      Notify about a guest
                    </Button>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title-row">
                    <div>
                      <Pill>Today</Pill>
                      <h3>Household tasks</h3>
                    </div>
                    <span>{chores.filter((chore) => chore.done).length}/{chores.length} complete</span>
                  </div>

                  <div className="chore-list">
                    {chores.map((chore) => (
                      <button
                        key={chore.id}
                        className={chore.done ? "chore done" : "chore"}
                        onClick={() => toggleChore(chore.id)}
                      >
                        <span className="checkbox">{chore.done ? "✓" : ""}</span>
                        <div>
                          <strong>{chore.title}</strong>
                          <small>{chore.owner} · {chore.due}</small>
                        </div>
                        <span>{chore.done ? "Complete" : "Pending"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title-row">
                    <div>
                      <Pill>House updates</Pill>
                      <h3>Guest notifications</h3>
                    </div>
                    <button className="text-button" onClick={() => setScreen("guest")}>
                      Add guest
                    </button>
                  </div>

                  {guestUpdates.length === 0 ? (
                    <div className="empty-state">
                      No guest visits have been added.
                    </div>
                  ) : (
                    <div className="activity-list">
                      {guestUpdates.map((guest) => (
                        <div className="activity-item" key={guest.id}>
                          <span className="activity-icon">↗</span>
                          <div>
                            <strong>{guest.type} visit</strong>
                            <p>{guest.arrival} to {guest.departure}</p>
                          </div>
                          <Pill tone={guest.status === "notified" ? "success" : "warning"}>
                            {guest.status}
                          </Pill>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <aside className="dashboard-side">
                <div className="card">
                  <div className="card-title-row">
                    <div>
                      <Pill tone="success">Agreement</Pill>
                      <h3>Key household terms</h3>
                    </div>
                    <button className="text-button" onClick={() => setScreen("agreement")}>
                      View all
                    </button>
                  </div>

                  <div className="term-mini-list">
                    {agreementTerms.slice(0, 5).map((term) => (
                      <div key={term.id}>
                        <strong>{term.title}</strong>
                        <p>{term.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card pattern-card">
                  <Pill tone="warning">Pattern detected</Pill>
                  <h3>Overnight guest concerns</h3>
                  <p>
                    This category has been logged twice recently. If it happens
                    again, the app will suggest a check-in or agreement update.
                  </p>
                </div>

                <div className="card">
                  <h3>Recent activity</h3>
                  <div className="activity-list compact">
                    {issues.slice(-3).reverse().map((issue) => (
                      <div className="activity-item" key={issue.id}>
                        <span className="activity-icon">•</span>
                        <div>
                          <strong>{issue.category}</strong>
                          <p>{issue.description}</p>
                        </div>
                        <Pill tone={issue.status === "resolved" ? "success" : "warning"}>
                          {issue.status}
                        </Pill>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </section>
        )}

        {screen === "guest" && (
          <section className="narrow">
            <SectionHeader
              eyebrow="House update"
              title="Notify your roommate about a guest"
              subtitle="The app checks the visit against your existing guest agreement."
            />

            <div className="card form-card">
              <label>
                Guest type
                <select
                  value={guestForm.type}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      type: event.target.value
                    }))
                  }
                >
                  <option>Friend</option>
                  <option>Partner</option>
                  <option>Family</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Arrival
                <input
                  value={guestForm.arrival}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      arrival: event.target.value
                    }))
                  }
                />
              </label>

              <label>
                Departure
                <input
                  value={guestForm.departure}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      departure: event.target.value
                    }))
                  }
                />
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={guestForm.overnight}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      overnight: event.target.checked
                    }))
                  }
                />
                <span>This is an overnight visit</span>
              </label>

              <div className={guestForm.overnight ? "policy-check warning" : "policy-check success"}>
                <strong>
                  {guestForm.overnight
                    ? "Approval may be required"
                    : "This visit follows your agreement"}
                </strong>
                <p>
                  {guestForm.overnight
                    ? "Your agreement requires notice and may require approval for overnight stays."
                    : "Your roommate will receive a neutral house update."}
                </p>
              </div>

              <div className="button-row">
                <Button variant="secondary" onClick={() => setScreen("dashboard")}>
                  Cancel
                </Button>
                <Button onClick={addGuestUpdate}>
                  {guestForm.overnight ? "Request approval" : "Send notification"}
                </Button>
              </div>
            </div>
          </section>
        )}

        {screen === "report" && (
          <section className="narrow">
            <SectionHeader
              eyebrow="Private issue log"
              title="What happened?"
              subtitle="Nothing is sent until you review the agreement reference and choose a neutral message."
            />

            <div className="card form-card">
              <label>
                Category
                <select
                  value={issueDraft.category}
                  onChange={(event) =>
                    setIssueDraft((current) => ({
                      ...current,
                      category: event.target.value
                    }))
                  }
                >
                  <option value="chores">Chores not done</option>
                  <option value="guests">Guests</option>
                  <option value="overnight">Overnight partner</option>
                  <option value="noise">Noise</option>
                  <option value="privacy">Privacy or access</option>
                  <option value="expenses">Shared expense</option>
                </select>
              </label>

              <label>
                Describe the issue
                <textarea
                  rows="5"
                  placeholder="Example: My roommate's boyfriend has stayed here for four nights this week."
                  value={issueDraft.description}
                  onChange={(event) =>
                    setIssueDraft((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                />
              </label>

              <div className="privacy-note">
                This is private until you choose a message and send it.
              </div>

              <div className="button-row">
                <Button variant="secondary" onClick={() => setScreen("dashboard")}>
                  Cancel
                </Button>
                <Button
                  onClick={submitIssue}
                  disabled={!issueDraft.description.trim()}
                >
                  Review against agreement
                </Button>
              </div>
            </div>
          </section>
        )}

        {screen === "nudge" && (
          <section className="narrow-wide">
            <SectionHeader
              eyebrow="Neutral mediation"
              title="The app found the relevant agreement term"
              subtitle="It is not inventing a new rule. It is referring to something both roommates accepted."
            />

            <div className="two-column">
              <div className="card">
                <Pill>Reported issue</Pill>
                <h3>{issueDraft.description}</h3>

                <div className="agreement-reference">
                  <small>Relevant agreement</small>
                  <strong>{activeIssueTerm?.title || "No exact term found"}</strong>
                  <p>
                    {activeIssueTerm?.text ||
                      "The app could not find a matching term. You can still send a neutral check-in."}
                  </p>
                </div>

                {recurringCount >= 3 && (
                  <div className="pattern-alert">
                    <Pill tone="warning">Recurring issue</Pill>
                    <strong>
                      This category has now been raised {recurringCount} times.
                    </strong>
                    <p>
                      The app recommends a roommate check-in or renegotiating
                      the original term.
                    </p>
                  </div>
                )}
              </div>

              <div className="card">
                <Pill tone="accent">Choose a tone</Pill>
                <div className="tone-tabs">
                  {["gentle", "direct", "collaborative"].map((tone) => (
                    <button
                      key={tone}
                      className={selectedTone === tone ? "active" : ""}
                      onClick={() => setSelectedTone(tone)}
                    >
                      {tone}
                    </button>
                  ))}
                </div>

                <div className="message-preview">
                  <p>{nudgeOptions[selectedTone]}</p>
                </div>

                <div className="button-row">
                  <Button variant="secondary" onClick={() => setScreen("report")}>
                    Edit issue
                  </Button>
                  <Button onClick={sendNudge}>Send through app</Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {screen === "response" && (
          <section className="narrow">
            <SectionHeader
              eyebrow="Household check-in"
              title="A concern was raised"
              subtitle="The receiving roommate responds to the agreement, not to an accusation."
            />

            <div className="card response-card">
              <Pill tone="success">Message sent</Pill>
              <blockquote>{sentNudge?.text}</blockquote>

              <div className="response-options">
                <button onClick={() => resolveIssue("acknowledge")}>
                  <strong>I understand</strong>
                  <span>I will follow the agreement going forward.</span>
                </button>
                <button onClick={() => resolveIssue("special")}>
                  <strong>This was a special situation</strong>
                  <span>I acknowledge the rule and want to explain.</span>
                </button>
                <button onClick={() => resolveIssue("renegotiate")}>
                  <strong>Renegotiate the rule</strong>
                  <span>Update the agreement together.</span>
                </button>
                <button onClick={() => resolveIssue("disagree")}>
                  <strong>I disagree</strong>
                  <span>Start a neutral roommate check-in.</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
