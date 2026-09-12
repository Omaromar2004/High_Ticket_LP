'use client';

import React, { useEffect, useState } from 'react';

export default function FiqrtaalimPartnershipPage() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- scroll reveal ---- */
    const rvs = document.querySelectorAll('.rv');
    if (reduce) {
      rvs.forEach((e) => e.classList.add('in'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const parent = en.target.parentNode;
            if (parent) {
              const sibs = Array.prototype.slice
                .call(parent.children)
                .filter((n) => n.classList.contains('rv'));
              const i = Math.max(0, sibs.indexOf(en.target));
              (en.target as HTMLElement).style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
            }
            en.target.classList.add('in');
            io.unobserve(en.target);
          });
        },
        { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
      );
      rvs.forEach((e) => io.observe(e));
    }

    /* ---- roadmap leg markers ---- */
    const legs = document.querySelectorAll('.leg');
    const lio = new IntersectionObserver(
      (en) => {
        en.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            lio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    legs.forEach((l) => lio.observe(l));

    /* ---- counter on the ledger total ---- */
    const amt = document.getElementById('totalAmt');
    if (amt) {
      const span = amt.querySelector('[data-count]');
      if (span) {
        const target = parseInt(span.getAttribute('data-count') || '109000', 10);
        const cio = new IntersectionObserver(
          (en) => {
            en.forEach((e) => {
              if (!e.isIntersecting) return;
              cio.unobserve(e.target);
              if (reduce) {
                span.textContent = target.toLocaleString('en-IN');
                amt.classList.add('struck');
                return;
              }
              let t0: number | null = null;
              const dur = 1500;
              function step(ts: number) {
                if (!t0) t0 = ts;
                const p = Math.min((ts - t0) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                span!.textContent = Math.round(target * eased).toLocaleString('en-IN');
                if (p < 1) {
                  requestAnimationFrame(step);
                } else {
                  amt!.classList.add('struck');
                }
              }
              requestAnimationFrame(step);
            });
          },
          { threshold: 0.5 }
        );
        cio.observe(amt);
      }
    }

    /* ---- qalam rail + road fill + nav + floating dock ---- */
    const nav = document.getElementById('nav');
    const ink = document.getElementById('railInk');
    const nib = document.getElementById('railNib');
    const floatingDock = document.getElementById('floatingDock');
    const road = document.getElementById('road');
    const roadFill = document.getElementById('roadFill');
    let ticking = false;

    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(y / h, 1) : 0;

      if (ink) ink.style.height = `${p * 100}%`;
      if (nib) nib.style.top = `${p * 100}%`;

      if (nav) nav.classList.toggle('is-stuck', y > 40);
      if (floatingDock) floatingDock.classList.toggle('up', y > 450);

      if (road && roadFill) {
        const r = road.getBoundingClientRect();
        const vh = window.innerHeight;
        const prog = (vh * 0.65 - r.top) / r.height;
        roadFill.style.height = `${Math.max(0, Math.min(prog, 1)) * 100}%`;
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(onScroll);
        }
      },
      { passive: true }
    );
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    /* ---- accordion: one open at a time ---- */
    const dets = document.querySelectorAll('.faq details');
    dets.forEach((d) => {
      d.addEventListener('toggle', () => {
        if (!(d as HTMLDetailsElement).open) return;
        dets.forEach((o) => {
          if (o !== d) (o as HTMLDetailsElement).open = false;
        });
      });
    });

    /* ---- hero entrance sequence ---- */
    if (!reduce) {
      const heroBits = document.querySelectorAll('.hero .rv');
      heroBits.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('in');
        }, 180 + i * 130);
      });
    }
  }, []);

  return (
    <>
      {/* ===== SIGNATURE: the qalam rail ===== */}
      <div className="rail" aria-hidden="true">
        <div className="rail__track"></div>
        <div className="rail__ink" id="railInk"></div>
        <div className="rail__nib" id="railNib">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 1c3.6 3.4 5.6 7.2 5.6 11.1 0 4.2-2.3 8-5.6 10.9-3.3-2.9-5.6-6.7-5.6-10.9C6.4 8.2 8.4 4.4 12 1Z"
              fill="#D4AF6A"
              opacity=".9"
            />
            <path d="M12 2v20" stroke="#0A0908" strokeWidth=".9" opacity=".6" />
          </svg>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <header className="nav" id="nav">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF6A] to-[#8A6A2C] p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0908] rounded-[7px] flex items-center justify-center text-[#D4AF6A] font-serif font-bold text-sm">
              FT
            </div>
          </div>
          <span className="font-serif text-lg tracking-wider text-[#F2EBDD] font-bold">
            FIQRTAALIM
          </span>
        </div>
        <div className="nav__right">
          <span className="nav__note">Partnership Programme · Anniversary Batch</span>
          <a
            className="btn btn--sm btn-shiny"
            href="/installment/"
          >
            Book your seat now
          </a>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="tile"></div>
        <div
          className="glow glow--gold"
          style={{ width: '620px', height: '620px', top: '-14%', left: '50%', transform: 'translateX(-50%)' }}
        ></div>
        <div
          className="glow glow--rose"
          style={{ width: '420px', height: '420px', bottom: '-8%', right: '-6%' }}
        ></div>

        <div className="hero__arch" aria-hidden="true">
          <svg viewBox="0 0 800 900" fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF6A" stopOpacity=".55" />
                <stop offset="55%" stopColor="#D4AF6A" stopOpacity=".16" />
                <stop offset="100%" stopColor="#D4AF6A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              id="archPath"
              d="M120 880 V420 C120 250 240 120 400 60 C560 120 680 250 680 420 V880"
              stroke="url(#ag)"
              strokeWidth="1.25"
            />
            <path
              d="M170 880 V430 C170 275 275 160 400 108 C525 160 630 275 630 430 V880"
              stroke="url(#ag)"
              strokeWidth=".7"
              opacity=".55"
            />
            <circle cx="400" cy="196" r="3" fill="#D4AF6A" opacity=".45" />
          </svg>
        </div>

        <div className="wrap hero__inner">
          <p className="ayah rv">نٓ ۚ وَٱلْقَلَمِ وَمَا يَسْطُرُونَ</p>
          <p className="ayah-t rv">Nūn. By the pen and what they inscribe · Al-Qalam 68:1</p>

          <h1 className="h-xl rv">
            Thirty days from now,
            <br />
            you will not be a learner.
            <br />
            <em>You will be an owner.</em>
          </h1>

          <p className="hero__sub rv">
            Not a recorded course. A 1-on-1 guided partnership where you build every part of your brand yourself — with ₹25,000 in free opening inventory.
          </p>

          {/* Hero VSL Video Placeholder */}
          <div
            className="hero-vsl rv"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
          >
            <div className="hero-vsl__tag">
              <span></span>
              Fiqrtaalim Masterclass
            </div>

            {isVideoPlaying ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0d0c0a]">
                <div className="w-14 h-14 rounded-full bg-[#D4AF6A]/15 border border-[#D4AF6A] flex items-center justify-center text-[#D4AF6A] mb-3">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-[#F2EBDD] font-normal mb-1">
                  Fiqrtaalim Partnership Walkthrough
                </h3>
                <p className="text-xs text-[#F2EBDD]/60 max-w-sm">
                  Replace this placeholder with your custom VSL video URL (YouTube unlisted, Vimeo, or MP4).
                </p>
              </div>
            ) : (
              <>
                <div className="hero-vsl__overlay"></div>
                <div className="hero-vsl__play">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="hero-vsl__caption">
                  <span>How the Partnership Works</span>
                  <span>Watch Before Enrolling</span>
                </div>
              </>
            )}
          </div>

          <div className="hero__cta rv">
            <a
              className="btn btn--wide btn-shiny"
              href="/installment/"
            >
              Book your seat now — ₹29,899
            </a>
            <a className="btn btn--ghost btn--sm" href="#ledger">
              See exactly what you get
            </a>
            <p className="microtrust">
              One-time. Secure payment by <b>Razorpay</b> · Agreement signed before we begin
            </p>
          </div>

          {/* Hero Metric Strip (Updated: Upto 30 & ₹25k in revenue, free) */}
          <div className="strip rv">
            <div className="strip__i">
              <div className="strip__n tnum">
                365<span className="gold">+</span>
              </div>
              <div className="strip__l">Islamic stores built</div>
            </div>
            <div className="strip__i">
              <div className="strip__n">Upto 30</div>
              <div className="strip__l">Days to launch</div>
            </div>
            <div className="strip__i">
              <div className="strip__n">1 : 1</div>
              <div className="strip__l">Account manager</div>
            </div>
            <div className="strip__i">
              <div className="strip__n">₹25k</div>
              <div className="strip__l">In revenue, free</div>
            </div>
          </div>
        </div>

        <div className="scrollcue" aria-hidden="true">
          <span></span>Scroll
        </div>
      </section>

      {/* ===== BRIDGE ===== */}
      <section className="band bridge">
        <div className="wrap">
          <p className="eyebrow rv">Where you are standing right now</p>
          <h2 className="h-lg rv" style={{ maxWidth: '20ch' }}>
            You have the niyyah.
            <br />
            What you don&apos;t have is a <span className="gold">team</span>.
          </h2>
          <p className="lede rv" style={{ marginTop: '22px' }}>
            You sat through the bootcamp. You saw it is possible. And then the questions started — and every one of them is a wall you&apos;d have to climb alone.
          </p>

          <div className="pains">
            <div className="pain rv">
              <div className="pain__k">&ldquo;Which product do I even start with?&rdquo;</div>
              <p className="pain__b">
                You scroll for weeks, second-guess every idea, and by the time you decide, the motivation is gone.
              </p>
            </div>
            <div className="pain rv">
              <div className="pain__k">&ldquo;Who will build my website?&rdquo;</div>
              <p className="pain__b">
                Agencies quote ₹25,000 and disappear for a month. Freelancers ghost. You end up with a template you can&apos;t edit.
              </p>
            </div>
            <div className="pain rv">
              <div className="pain__k">&ldquo;My ad account keeps getting restricted.&rdquo;</div>
              <p className="pain__b">
                Pixel, Business Suite, payment method, ad copy. One wrong setting and you&apos;re burning money with nothing to show.
              </p>
            </div>
            <div className="pain rv">
              <div className="pain__k">&ldquo;Where do I get stock without blocking my savings?&rdquo;</div>
              <p className="pain__b">
                Minimum order quantities, cash locked in a warehouse, and no idea whether it sells.
              </p>
            </div>
            <div className="pain rv">
              <div className="pain__k">&ldquo;Payment gateway on a savings account?&rdquo;</div>
              <p className="pain__b">Most people are simply told no, and stop there.</p>
            </div>
            <div className="pain rv">
              <div className="pain__k">&ldquo;Is this even halal and clean?&rdquo;</div>
              <p className="pain__b">
                You want rizq you can raise your hands over. Not a shortcut you&apos;d have to explain on the Day.
              </p>
            </div>
          </div>

          <div className="verdict rv">
            <p>
              Ek dukan ka deposit hi <span className="gold">3 lakh</span> — aur customer ki koi guarantee nahi.
              <br />
              Yahan aap ek <span className="gold">brand</span> khade kar rahe hain, ek kiraya nahi.
            </p>
          </div>
        </div>
      </section>

      {/* ===== LEDGER ===== */}
      <section className="band" id="ledger">
        <div className="wrap">
          <div className="center">
            <div className="rosette rv" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none" stroke="#D4AF6A" strokeWidth=".9">
                <path
                  d="M20 2 24.6 12.2 35 8.4 31.2 18.8 41 24 31.2 29.2 35 39.6 24.6 35.8 20 46 15.4 35.8 5 39.6 8.8 29.2 -1 24 8.8 18.8 5 8.4 15.4 12.2Z"
                  transform="translate(0,-3) scale(.93) translate(1.5,2)"
                />
                <circle cx="20" cy="20" r="4.4" />
              </svg>
            </div>
            <p className="eyebrow eyebrow--c rv">What the market charges</p>
            <h2 className="h-lg rv">
              Thirteen things a brand needs.
              <br />
              Here is what each one <span className="gold">actually costs</span>.
            </h2>
            <p className="lede rv" style={{ marginTop: '20px' }}>
              Not a guess. These are the going rates you&apos;d pay a designer, a developer, an agency and a media buyer — separately, to different people, with no one accountable for the outcome.
            </p>
          </div>

          <div className="ledger rv" id="ledgerBox">
            <div className="ledger__head">
              <span>Deliverable</span>
              <span>Market rate</span>
            </div>

            <div className="row">
              <span className="row__n">01</span>
              <span className="row__t">Logo &amp; brand identity design</span>
              <span className="row__p">₹3,000</span>
            </div>
            <div className="row">
              <span className="row__n">02</span>
              <span className="row__t">
                Website development<small>Shopify store, product pages, checkout</small>
              </span>
              <span className="row__p">₹25,000</span>
            </div>
            <div className="row">
              <span className="row__n">03</span>
              <span className="row__t">Instagram set up for business</span>
              <span className="row__p">₹5,000</span>
            </div>
            <div className="row">
              <span className="row__n">04</span>
              <span className="row__t">WhatsApp Business training</span>
              <span className="row__p">₹3,000</span>
            </div>
            <div className="row">
              <span className="row__n">05</span>
              <span className="row__t">
                Product pricing strategy<small>Margins that survive ad spend and RTO</small>
              </span>
              <span className="row__p">₹8,000</span>
            </div>
            <div className="row">
              <span className="row__n">06</span>
              <span className="row__t">
                Business documentation<small>GST, Udyam, policies, invoicing</small>
              </span>
              <span className="row__p">₹5,000</span>
            </div>
            <div className="row">
              <span className="row__n">07</span>
              <span className="row__t">
                Shiprocket / iThink set up
                <small>Best available rates through our accounts, inshaAllah</small>
              </span>
              <span className="row__p na">Included</span>
            </div>
            <div className="row">
              <span className="row__n">08</span>
              <span className="row__t">
                Payment gateway on a savings account
                <small>The one most people are told is impossible</small>
              </span>
              <span className="row__p na">Handled</span>
            </div>
            <div className="row">
              <span className="row__n">09</span>
              <span className="row__t">Ad copy training</span>
              <span className="row__p">₹20,000</span>
            </div>
            <div className="row">
              <span className="row__n">10</span>
              <span className="row__t">
                Meta Business Suite set up
                <small>Ad account, pixel, catalogue, domain verification</small>
              </span>
              <span className="row__p">₹25,000</span>
            </div>
            <div className="row">
              <span className="row__n">11</span>
              <span className="row__t">
                Ad manager<small>A human who reads your numbers with you</small>
              </span>
              <span className="row__p">₹10,000</span>
            </div>
            <div className="row">
              <span className="row__n">12</span>
              <span className="row__t">Ad launching &amp; first campaign structure</span>
              <span className="row__p">₹5,000</span>
            </div>
            <div className="row">
              <span className="row__n">13</span>
              <span className="row__t">Lifetime access to every session recording</span>
              <span className="row__p na">Included</span>
            </div>

            <div className="ledger__foot">
              <span className="lbl">Total market price</span>
              <span className="amt" id="totalAmt">
                ₹<span className="tnum" data-count="109000">0</span>
              </span>
            </div>
          </div>

          <div className="price rv">
            <div className="tile" style={{ opacity: 0.16 }}></div>
            <div className="price__l">Your partnership investment</div>
            <div className="price__v">
              <span className="r">₹</span>29,899
            </div>
            <p className="price__m">
              One time. Everything above, done <em>with</em> you — not explained at you.
            </p>
            <div
              style={{
                marginTop: '34px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <a
                className="btn btn--wide btn-shiny"
                href="/installment/"
              >
                Book your seat now — ₹29,899
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KIT ===== */}
      <section className="band kit">
        <div
          className="glow glow--gold"
          style={{ width: '520px', height: '520px', top: '-20%', right: '-12%' }}
        ></div>
        <div className="wrap kit__grid">
          <div>
            <p className="eyebrow rv">The part nobody else does</p>
            <h2 className="h-lg rv">
              We don&apos;t tell you to
              <br />
              go find a product.
              <br />
              <span className="gold">We hand you ours.</span>
            </h2>
            <p className="lede rv" style={{ marginTop: '22px' }}>
              Every partner in this batch receives our tested, already-selling inventory as opening stock (worth ₹25,000 in customer revenue). Not samples. Real, sellable units — so your first sale doesn&apos;t wait on a supplier in another city.
            </p>
            <p className="lede rv">
              These are the products our own stores run on. You start where most people finish.
            </p>
            <div className="freestamp rv">
              <s>₹25,000</s> Free with this batch
            </div>
          </div>

          <div className="crate rv">
            <div className="crate__i">
              <span className="crate__n">
                Tayammum Kit<small>Complete boxed set</small>
              </span>
              <span className="crate__q">
                25 <em>units</em>
              </span>
            </div>
            <div className="crate__i">
              <span className="crate__n">
                Traceable Islamic Kids Activity Books<small>Set of 4</small>
              </span>
              <span className="crate__q">
                25 <em>sets</em>
              </span>
            </div>
            <div className="crate__i">
              <span className="crate__n">
                Dua Stickers — Hindi<small>Full sticker set</small>
              </span>
              <span className="crate__q">
                10 <em>sets</em>
              </span>
            </div>
            <div className="crate__i">
              <span className="crate__n">
                Dua Stickers — English<small>Full sticker set</small>
              </span>
              <span className="crate__q">
                10 <em>sets</em>
              </span>
            </div>
            <div className="crate__i">
              <span className="crate__n">
                Branded packaging material
                <small>Boxes, tape, inserts — ready to dispatch</small>
              </span>
              <span className="crate__q">Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <section className="band">
        <div className="wrap">
          <div className="center">
            <p className="eyebrow eyebrow--c rv">The Execution Roadmap</p>
            <h2 className="h-lg rv">A structured plan, not a promise.</h2>
            <p className="lede rv" style={{ marginTop: '20px' }}>
              You will know what happens at every stage, who is doing it, and what you owe us in return. That is what an amanah looks like when it is written down.
            </p>
          </div>

          <div className="road" id="road">
            <div className="road__fill" id="roadFill"></div>

            <div className="leg rv">
              <div className="leg__day">
                Step 01<small>Onboarding</small>
              </div>
              <div className="leg__body">
                <div className="leg__t">Agreement, onboarding, and your people</div>
                <p className="leg__b">
                  You sign the service agreement so both sides know exactly what is owed. Your dedicated account manager and your trainer are assigned by name. Your WhatsApp support line opens.
                </p>
              </div>
            </div>

            <div className="leg rv">
              <div className="leg__day">
                Step 02<small>Identity &amp; Stock</small>
              </div>
              <div className="leg__body">
                <div className="leg__t">Brand name, logo, domain, stock dispatched</div>
                <p className="leg__b">
                  We design your logo and lock your brand identity. Domain booked. Your free opening stock is packed and shipped to your address.
                </p>
              </div>
            </div>

            <div className="leg rv">
              <div className="leg__day">
                Step 03<small>Store Build</small>
              </div>
              <div className="leg__body">
                <div className="leg__t">Your store gets built</div>
                <p className="leg__b">
                  Full website development, product pages written and priced with real margin, payment gateway activated, Shiprocket / iThink connected with our negotiated rates. You watch it being built and learn it as it happens.
                </p>
              </div>
            </div>

            <div className="leg rv">
              <div className="leg__day">
                Step 04<small>Ad Infrastructure</small>
              </div>
              <div className="leg__body">
                <div className="leg__t">Presence and ad infrastructure</div>
                <p className="leg__b">
                  Instagram business profile set up properly. WhatsApp Business configured. Meta Business Suite, ad account, pixel and domain verification done correctly the first time. Creatives and ad copy prepared with you.
                </p>
              </div>
            </div>

            <div className="leg rv">
              <div className="leg__day">
                Step 05<small>Launch &amp; Sales</small>
              </div>
              <div className="leg__body">
                <div className="leg__t">Ads live. Orders. Dispatch.</div>
                <p className="leg__b">
                  Campaigns launched and reviewed with your ad manager. You learn to read the numbers — CPM, CTR, CPP — instead of guessing. Orders are packed and dispatched from your hands.
                </p>
              </div>
            </div>

            <div className="leg rv">
              <div className="leg__day">
                Step 06<small>Scale &amp; Community</small>
              </div>
              <div className="leg__body">
                <div className="leg__t">You graduate into the group</div>
                <p className="leg__b">
                  Once your first sales are through, you move into six months of group training with other Fiqr owners — scaling, new products, seasonal planning. You are never dropped, only levelled up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARTNERSHIP STRUCTURE ===== */}
      <section className="band bridge">
        <div className="wrap">
          <p className="eyebrow rv">Why we call it a partnership</p>
          <h2 className="h-lg rv" style={{ maxWidth: '24ch' }}>
            Mentorship gives advice.
            <br />
            A partner picks up the <span className="gold">tools</span>.
          </h2>

          <div className="duo">
            <div className="duo__c rv">
              <div className="duo__r">Your account manager</div>
              <div className="duo__t">One person. Your name in their sheet.</div>
              <p className="duo__b">
                Not a helpdesk queue. A named account manager who knows which stage you are at, chases what is pending, and answers on your support line through the build. Every partner is tracked in our master sheet — over 200 owners and counting.
              </p>
            </div>
            <div className="duo__c rv">
              <div className="duo__r">Your trainer</div>
              <div className="duo__t">Alternate-day sessions until you launch.</div>
              <p className="duo__b">
                Working sessions, not lectures — screen shared, your store open, your ad account open. Every session recorded and yours for life. From logo through to your first dispatched order.
              </p>
            </div>
          </div>

          <div className="assure" style={{ marginTop: '1px' }}>
            <div className="assure__i rv">
              <div className="assure__t">You build it, you master it</div>
              <p className="assure__b">
                We make you build every single part yourself — your Shopify store, payment gateway, Meta ads, and logistics. Your dedicated mentor guides you step-by-step on live screen-share so you gain 100% practical understanding and total independence.
              </p>
            </div>
            <div className="assure__i rv">
              <div className="assure__t">Written before it starts</div>
              <p className="assure__b">
                A formal service agreement lists every deliverable, timeline and responsibility on both sides. Read it fully, ask anything, then sign.
              </p>
            </div>
            <div className="assure__i rv">
              <div className="assure__t">Built by people who sell</div>
              <p className="assure__b">
                Fiqr runs its own Islamic D2C brands. We are not teaching from a slide deck — we are handing you the same products and playbook we use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="band">
        <div className="wrap">
          <div className="center">
            <p className="eyebrow eyebrow--c rv">In their own words</p>
            <h2 className="h-lg rv">
              365+ brands. Ordinary people.
              <br />
              Same 30 days.
            </h2>
            <p className="lede rv" style={{ marginTop: '20px' }}>
              Students, homemakers, job-holders, madrasah graduates. Different cities, one method.
            </p>
          </div>

          <div className="vids">
            <div className="vid rv">
              <div className="vid__tag">
                <span className="vid__tag-dot"></span>
                <span>Verified Brand</span>
              </div>
              <iframe
                src="https://player.vimeo.com/video/1218704423?dnt=1&title=0&byline=0&portrait=0"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                allowFullScreen
                title="Fiqrtaalim Partner Story 1"
              ></iframe>
            </div>

            <div className="vid rv">
              <div className="vid__tag">
                <span className="vid__tag-dot"></span>
                <span>First 50 Orders</span>
              </div>
              <iframe
                src="https://player.vimeo.com/video/1213250646?dnt=1&title=0&byline=0&portrait=0"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                allowFullScreen
                title="Fiqrtaalim Partner Story 2"
              ></iframe>
            </div>

            <div className="vid rv">
              <div className="vid__tag">
                <span className="vid__tag-dot"></span>
                <span>Scaled Brand</span>
              </div>
              <iframe
                src="https://player.vimeo.com/video/1213250657?dnt=1&title=0&byline=0&portrait=0"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                allowFullScreen
                title="Fiqrtaalim Partner Story 3"
              ></iframe>
            </div>

            <div className="vid rv">
              <div className="vid__tag">
                <span className="vid__tag-dot"></span>
                <span>1-on-1 Mentorship</span>
              </div>
              <iframe
                src="https://player.vimeo.com/video/1213250642?dnt=1&title=0&byline=0&portrait=0"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                allowFullScreen
                title="Fiqrtaalim Partner Story 4"
              ></iframe>
            </div>
          </div>

          <div className="center" style={{ marginTop: '42px' }}>
            <a
              className="btn rv btn-shiny"
              href="/installment/"
            >
              Book your seat now — ₹29,899
            </a>
          </div>
        </div>
      </section>

      {/* ===== DEEN ===== */}
      <section className="band deen">
        <div className="tile" style={{ opacity: 0.22 }}></div>
        <div
          className="glow glow--rose"
          style={{ width: '460px', height: '460px', top: '10%', left: '-10%' }}
        ></div>
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="center">
            <div className="rosette rv" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none" stroke="#D4AF6A" strokeWidth=".9">
                <rect x="9" y="9" width="22" height="22" />
                <rect x="9" y="9" width="22" height="22" transform="rotate(45 20 20)" />
                <circle cx="20" cy="20" r="4.4" />
              </svg>
            </div>
            <p className="eyebrow eyebrow--c rv">Why we do this at all</p>
            <h2 className="h-lg rv">
              Rizq you can raise
              <br />
              your hands over.
            </h2>
            <p className="lede rv" style={{ marginTop: '20px' }}>
              Fiqr exists because the ummah should not have to choose between earning well and earning cleanly. Every brand we build sells something a Muslim household is glad to receive.
            </p>
          </div>

          <div className="quotes">
            <div className="q rv">
              <p className="q__ar">وَأَحَلَّ ٱللَّهُ ٱلْبَيْعَ وَحَرَّمَ ٱلرِّبَوٰا۟</p>
              <p className="q__en">&ldquo;Allah has permitted trade and forbidden interest.&rdquo;</p>
              <p className="q__s">Qur&apos;an · Al-Baqarah 2:275</p>
            </div>
            <div className="q rv">
              <p className="q__ar">
                ٱلتَّاجِرُ ٱلصَّدُوقُ ٱلْأَمِينُ مَعَ ٱلنَّبِيِّينَ وَٱلصِّدِّيقِينَ وَٱلشُّهَدَآءِ
              </p>
              <p className="q__en">
                &ldquo;The truthful and trustworthy merchant is with the prophets, the truthful, and the martyrs.&rdquo;
              </p>
              <p className="q__s">Sunan al-Tirmidhī 1209</p>
            </div>
            <div className="q rv">
              <p className="q__ar">إِنَّ ٱللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ</p>
              <p className="q__en">
                &ldquo;Allah loves that when one of you does a work, he does it with excellence — itqān.&rdquo;
              </p>
              <p className="q__s">al-Bayhaqī, Shu&apos;ab al-Īmān</p>
            </div>
          </div>

          <div className="verdict rv" style={{ marginTop: '44px' }}>
            <p>
              Amānah in the agreement. Itqān in the build.
              <br />
              <span className="gold">Tawakkul</span> in the outcome.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="band">
        <div className="wrap" style={{ maxWidth: '920px' }}>
          <div className="center">
            <p className="eyebrow eyebrow--c rv">Before you decide</p>
            <h2 className="h-lg rv">Ask it now, not later.</h2>
          </div>

          <div className="faq rv">
            <details>
              <summary>Is this a course?</summary>
              <div className="ans">
                <p>
                  No. A traditional course hands you videos and leaves execution to you. Here, you build your own store, set up your payment gateway, and launch your ads with a dedicated mentor sitting on your side of the table guiding every step live on screen-share. We don&apos;t do it for you so you become dependent — we make you build it so you understand and master every single aspect of your brand forever.
                </p>
              </div>
            </details>
            <details>
              <summary>I have no experience and no technical background. Can I still do this?</summary>
              <div className="ans">
                <p>
                  Yes — that is precisely who this is built for. Most of our 365+ owners started with a phone, a bank account and a decision. Your trainer works at your pace on alternate days, and every session is recorded so you can rewatch it as many times as you need.
                </p>
              </div>
            </details>
            <details>
              <summary>What do I have to spend beyond ₹29,899?</summary>
              <div className="ans">
                <p>
                  Your opening stock for this batch is free — that is roughly ₹25,000 of customer revenue inventory covered. The only separate external expenses you need to plan for are:
                </p>
                <ul className="list-disc list-inside space-y-1.5 mt-2 mb-2 text-sm text-[#F2EBDD]/80">
                  <li><b>Domain Registration:</b> Paid directly to the domain registrar for your brand name (.com / .in), typically ₹500–₹900/year.</li>
                  <li><b>Inventory Delivery Charges:</b> The courier shipping fee to dispatch the opening inventory crate directly to your doorstep.</li>
                  <li><b>Advertising Budget:</b> Paid directly to Meta (Facebook &amp; Instagram) from your own card. Your ad manager will help you set a lean, realistic starting budget based on your margins.</li>
                </ul>
                <p>
                  Restocking inventory after your initial sales comes directly out of the customer revenue those sales generate.
                </p>
              </div>
            </details>
            <details>
              <summary>How much time will this take every day?</summary>
              <div className="ans">
                <p>
                  Plan for one to two focused hours on session days, and a little less in between. Many partners run this alongside a job or studies. What matters more than hours is showing up on the days your trainer has scheduled — the 30-day plan only holds if you hold your side of it.
                </p>
              </div>
            </details>
            <details>
              <summary>Is the business model halal?</summary>
              <div className="ans">
                <p>
                  The products are Islamic lifestyle goods — tayammum kits, kids&apos; Islamic activity books, du&apos;ā sticker sets. The model is straightforward trade: you buy stock, you add value, you sell it at a stated price. No interest, no gharar in the pricing, no recruitment-based income. What you earn is a merchant&apos;s margin.
                </p>
              </div>
            </details>
            <details>
              <summary>Is my income guaranteed?</summary>
              <div className="ans">
                <p>
                  No, and anyone who promises you one is not being honest with you. What is guaranteed is the work: the deliverables listed in your agreement, delivered within the stated timeline. Results depend on your product choices, your ad budget, your market and — above all — tawakkul after effort. We commit to the effort with you.
                </p>
              </div>
            </details>
            <details>
              <summary>What exactly does the agreement cover?</summary>
              <div className="ans">
                <p>
                  Before any work starts you receive a formal service agreement listing every deliverable, the timeline, the responsibilities on both sides, the payment terms and the support scope. It is sent to your email and WhatsApp for you to read at your own pace. Nothing begins until you have signed it — and if something in it is unclear, ask us before you do.
                </p>
              </div>
            </details>
            <details>
              <summary>What happens immediately after I pay?</summary>
              <div className="ans">
                <p>
                  You will receive a confirmation and your service agreement, usually the same day. Once signed, your account manager and trainer are assigned by name and your onboarding call is scheduled. Your support line opens from that point.
                </p>
              </div>
            </details>
            <details>
              <summary>Can I speak to someone before paying?</summary>
              <div className="ans">
                <p>
                  Yes. Message us on WhatsApp at{' '}
                  <a href="https://wa.me/919945891650" className="gold">
                    9945891650
                  </a>{' '}
                  and our team will call you back. If your number has ever been unreachable on our side, call{' '}
                  <a href="tel:+917829208722" className="gold">
                    7829208722
                  </a>{' '}
                  directly.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="band final">
        <div className="tile" style={{ opacity: 0.2 }}></div>
        <div className="wrap" style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
          <div className="seats rv">
            <i></i>Anniversary batch · limited partner seats
          </div>
          <h2 className="h-xl rv" style={{ marginBottom: '22px' }}>
            InshaAllah, thirty days
            <br />
            from today.
          </h2>
          <p className="lede rv" style={{ marginInline: 'auto' }}>
            Your own Islamic brand, live. Your store running. Your ads working. Your first orders arriving. You will no longer be someone who once attended a webinar — you will be an owner with a name on a package.
          </p>
          <p className="lede rv" style={{ marginInline: 'auto', color: 'var(--cream)', marginTop: '18px' }}>
            That is the transformation we are inviting you into.
          </p>

          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <a
              className="btn btn--wide rv btn-shiny"
              href="/installment/"
            >
              Book your seat now — ₹29,899
            </a>
            <p className="microtrust rv">
              Secure one-time payment via <b>Razorpay</b> · UPI, cards, net banking · Agreement before work begins
            </p>
            <a
              className="btn btn--ghost btn--sm rv"
              href="https://wa.me/919945891650"
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to us on WhatsApp first
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="foot">
        <div className="wrap foot__grid">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF6A] to-[#8A6A2C] p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-[#0A0908] rounded-[7px] flex items-center justify-center text-[#D4AF6A] font-serif font-bold text-xs">
                  FT
                </div>
              </div>
              <span className="font-serif text-base tracking-wider text-[#F2EBDD] font-bold">
                FIQRTAALIM
              </span>
            </div>
            <p>
              India&apos;s Islamic business education company, built under the Fiqr Group of Companies. From the Arabic{' '}
              <span style={{ fontFamily: 'var(--font-amiri), serif' }} className="gold">
                فِكْر
              </span>{' '}
              — thought.
            </p>
            <p style={{ marginTop: '14px' }}>Mysuru, Karnataka, India</p>
          </div>
          <div>
            <h4>Reach us</h4>
            <ul>
              <li>
                <a href="https://wa.me/919945891650">WhatsApp · 9945891650</a>
                <br />
                <span style={{ opacity: 0.6 }}>Messages only — we reply here</span>
              </li>
              <li>
                <a href="tel:+917829208722">Callback line · 7829208722</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Registered</h4>
            <ul>
              <li>GSTIN · 29AFUPO5312G1Z2</li>
              <li>UDYAM · UDYAM-KR-22-0100523</li>
            </ul>
          </div>
        </div>
        <div className="wrap">
          <p className="disc">
            FIQRTAALIM provides business setup services and training. We do not guarantee income, profit, sales volume or business outcomes of any kind. Any figures shown on this page describe prevailing market rates for the listed services or the results of individual partners, and are not a representation of what you will earn. Results depend on your own effort, capital, product decisions, advertising budget and market conditions. Advertising spend is paid by you directly to the platform and is not included in the partnership fee. Full terms, deliverables and timelines are set out in the service agreement provided before work begins. ©{' '}
            <span id="yr">{currentYear}</span> Fiqr Group of Companies. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ===== FLOATING STICKY BOOK YOUR SEAT BAR ===== */}
      <div className="floating-dock" id="floatingDock">
        <div className="floating-dock__info">
          <div className="floating-dock__p">
            ₹29,899<small>Anniversary Batch · Limited Partner Seats</small>
          </div>
        </div>
        <a
          className="btn btn--sm btn-shiny"
          href="/installment/"
        >
          Book your seat now
        </a>
      </div>
    </>
  );
}
