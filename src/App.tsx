import React, { useState, useEffect } from 'react';
import { CinematicViewport } from './components/CinematicViewport';
import { Portal3DScene } from './components/Portal3DScene';

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [inCloudZone, setInCloudZone] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<'NEW YORK' | 'ZURICH' | 'TOKYO' | 'REYKJAVIK'>('ZURICH');
  const [timeOfDay, setTimeOfDay] = useState<'MORNING CLOUD' | 'GOLDEN HOUR'>('MORNING CLOUD');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Enforce document-level scroll lock whenever the video is not finished
  useEffect(() => {
    if (!isUnlocked) {
      window.scrollTo(0, 0);
      setInCloudZone(false);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.height = '100vh';
      document.body.style.height = '100vh';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    };
  }, [isUnlocked]);

  // Track scroll depth so the rectangular pill header shifts cleanly into cloud-light theme below the hero
  useEffect(() => {
    const onScroll = () => {
      setInCloudZone(window.scrollY > window.innerHeight * 0.65);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isUnlocked) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div style={{
      backgroundColor: isUnlocked ? '#f4efe6' : '#0c0c0e',
      color: '#181715',
      minHeight: '100vh',
      height: isUnlocked ? 'auto' : '100vh',
      overflow: isUnlocked ? 'visible' : 'hidden',
      position: 'relative',
      transition: 'background-color 0.6s ease'
    }}>
      {/* Soft Drifting Cumulus Cloud Atmosphere Behind the Lower Page */}
      <Portal3DScene active={isUnlocked} />

      {/* Floating Rectangular Pill Top Bar — Zero glowing neon dots */}
      <header style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '1160px',
        padding: '12px 16px 12px 24px',
        backgroundColor: inCloudZone
          ? 'rgba(252, 249, 244, 0.86)'
          : 'rgba(18, 18, 20, 0.76)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: inCloudZone
          ? '1px solid rgba(24, 23, 21, 0.1)'
          : '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '10px',
        boxShadow: inCloudZone
          ? '0 10px 32px rgba(24, 23, 21, 0.06)'
          : '0 12px 36px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
        transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease'
      }}>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display"
          style={{
            fontSize: '15px',
            letterSpacing: '0.2em',
            color: inCloudZone ? '#181715' : '#ffffff',
            textDecoration: 'none',
            transition: 'color 0.35s ease'
          }}
        >
          THRESHOLD
        </a>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px'
        }}>
          {[
            ['clouds', 'ABOVE THE CLOUDS'],
            ['rooms', 'THE CHAMBERS'],
            ['atmosphere', 'ATMOSPHERE'],
            ['houses', 'HOUSES']
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="font-mono nav-btn"
              style={{
                color: inCloudZone ? '#181715' : '#ffffff',
                opacity: isUnlocked ? 0.78 : 0.35,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                transition: 'color 0.35s ease, opacity 0.2s ease'
              }}
              title={isUnlocked ? `Jump to ${label}` : 'Finish the crossing first'}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('visit')}
            className="font-mono"
            style={{
              background: isUnlocked
                ? (inCloudZone ? '#181715' : '#ffffff')
                : 'rgba(255, 255, 255, 0.12)',
              color: isUnlocked
                ? (inCloudZone ? '#faf7f2' : '#181715')
                : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 16px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              cursor: isUnlocked ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
          >
            {isUnlocked ? 'RESERVE A VISIT' : 'SCROLL TO CROSS'}
          </button>
        </nav>
      </header>

      {/* Full-Screen Locked Hero Sequence */}
      <section
        id="top"
        style={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          zIndex: 10
        }}
      >
        <CinematicViewport onUnlockChange={setIsUnlocked} />

        {/* Soft Cloud Mist Feather at Bottom of Hero When Unlocked */}
        {isUnlocked && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '140px',
              background: 'linear-gradient(to bottom, rgba(244, 239, 230, 0) 0%, rgba(244, 239, 230, 0.85) 75%, #f4efe6 100%)',
              pointerEvents: 'none',
              zIndex: 20
            }}
          />
        )}
      </section>

      {/* CLOUD-THEMED LOWER EXPERIENCE — Sunlit Cumulus, Warm Stone & Open Sky */}
      <main style={{
        position: 'relative',
        zIndex: 5,
        color: '#181715'
      }}>
        {/* SECTION 01: ABOVE THE CLOUDS */}
        <section
          id="clouds"
          style={{
            padding: '140px 40px 120px 40px',
            maxWidth: '1280px',
            margin: '0 auto'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '64px',
            alignItems: 'center'
          }}>
            <div>
              <div className="font-mono" style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: '#78716c',
                marginBottom: '20px'
              }}>
                01 — ABOVE THE WEATHER
              </div>

              <h2 className="font-display" style={{
                fontSize: 'clamp(2.6rem, 5vw, 4.6rem)',
                lineHeight: 0.94,
                letterSpacing: '-0.03em',
                color: '#181715',
                margin: '0 0 28px 0'
              }}>
                BUILT TO LIVE INSIDE THE CLOUDS.
              </h2>

              <p style={{
                fontSize: '18px',
                lineHeight: 1.7,
                color: '#3f3d39',
                marginBottom: '24px',
                fontWeight: 400
              }}>
                Threshold is a collection of quiet architectural cloud-houses in four cities. You step through a dark basalt passage from the street directly into warm, sunlit cumulus mist and open alpine air.
              </p>

              <p style={{
                fontSize: '16px',
                lineHeight: 1.75,
                color: '#57534e',
                marginBottom: '40px'
              }}>
                Inside, there are no clocks, phones, or harsh artificial screens—only shifting banks of warm cloud vapor, natural skylight, and unhurried stillness.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                paddingTop: '28px',
                borderTop: '1px solid rgba(24, 23, 21, 0.12)'
              }}>
                <div>
                  <div className="font-display" style={{ fontSize: '28px', color: '#181715' }}>2,400m</div>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#78716c', letterSpacing: '0.14em', marginTop: '6px' }}>
                    ALPINE AIR EQUIVALENT
                  </div>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: '28px', color: '#181715' }}>60 MIN</div>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#78716c', letterSpacing: '0.14em', marginTop: '6px' }}>
                    UNHURRIED SESSIONS
                  </div>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: '28px', color: '#181715' }}>4 HOUSES</div>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#78716c', letterSpacing: '0.14em', marginTop: '6px' }}>
                    NY · ZURICH · TOKYO · RVK
                  </div>
                </div>
              </div>
            </div>

            {/* Layered Cloud Photography Stack */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(87, 75, 58, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}>
                <img
                  src="/frames/frame_130.jpg?v=240"
                  alt="Warm sunlit cumulus clouds inside Threshold"
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>

              <div style={{
                marginTop: '-48px',
                marginLeft: 'auto',
                width: '72%',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(87, 75, 58, 0.16)',
                border: '4px solid #f7f3eb',
                position: 'relative',
                zIndex: 2
              }}>
                <img
                  src="/frames/frame_155.jpg?v=240"
                  alt="Parting clouds revealing the valley"
                  style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: THE THREE CLOUD CHAMBERS */}
        <section
          id="rooms"
          style={{
            padding: '100px 40px 120px 40px',
            maxWidth: '1280px',
            margin: '0 auto'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '56px'
          }}>
            <div>
              <div className="font-mono" style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: '#78716c',
                marginBottom: '14px'
              }}>
                02 — THE SEQUENCE OF SPACES
              </div>
              <h2 className="font-display" style={{
                fontSize: 'clamp(2.2rem, 4.2vw, 3.8rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: '#181715',
                margin: 0
              }}>
                THREE ROOMS OF SKY.
              </h2>
            </div>

            <p style={{
              maxWidth: '420px',
              fontSize: '15px',
              lineHeight: 1.65,
              color: '#57534e',
              margin: 0
            }}>
              Each house is arranged as a slow progression from quiet shadow into open clouds and sunlit meadow air.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {[
              {
                step: 'ROOM I',
                title: 'THE RAIN STONE ENTRY',
                img: '/frames/frame_015.jpg?v=240',
                desc: 'Dark volcanic stone and shallow still water absorb the sound of the street outside so your eyes and breathing slow down before crossing.'
              },
              {
                step: 'ROOM II',
                title: 'THE CUMULUS CHAMBER',
                img: '/frames/frame_140.jpg?v=240',
                desc: 'A high-ceilinged room filled with warm, breathable cloud vapor illuminated by natural golden-hour sky from above.'
              },
              {
                step: 'ROOM III',
                title: 'THE OPEN VALLEY TERRACE',
                img: '/frames/frame_240.jpg?v=240',
                desc: 'Beyond the clouds, the sanctuary opens onto a sunlit alpine vista with cool mountain air, wildflower scent, and deep horizon views.'
              }
            ].map((room) => (
              <div
                key={room.step}
                style={{
                  backgroundColor: 'rgba(255, 253, 250, 0.78)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(24, 23, 21, 0.08)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(87, 75, 58, 0.07)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ aspectRatio: '16/11', overflow: 'hidden' }}>
                  <img
                    src={room.img}
                    alt={room.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
                <div style={{ padding: '28px 30px 32px 30px', flex: 1 }}>
                  <div className="font-mono" style={{
                    fontSize: '11px',
                    color: '#78716c',
                    letterSpacing: '0.18em',
                    marginBottom: '10px'
                  }}>
                    {room.step}
                  </div>
                  <h3 className="font-display" style={{
                    fontSize: '21px',
                    color: '#181715',
                    marginBottom: '12px',
                    letterSpacing: '-0.01em'
                  }}>
                    {room.title}
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: '#57534e',
                    margin: 0
                  }}>
                    {room.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 03: FULL-WIDTH CLOUD HORIZON BANNER */}
        <section
          id="atmosphere"
          style={{
            padding: '40px 40px 120px 40px',
            maxWidth: '1280px',
            margin: '0 auto'
          }}
        >
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            minHeight: '520px',
            display: 'flex',
            alignItems: 'flex-end',
            padding: 'clamp(32px, 5vw, 64px)',
            boxShadow: '0 32px 90px rgba(87, 75, 58, 0.14)',
            border: '1px solid rgba(255, 255, 255, 0.85)'
          }}>
            <img
              src="/frames/frame_180.jpg?v=240"
              alt="Clouds parting over the sunlit valley"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(24, 23, 21, 0.58) 0%, rgba(24, 23, 21, 0.08) 55%, rgba(255, 255, 255, 0) 100%)',
              zIndex: 1
            }} />

            <div style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '680px',
              color: '#ffffff'
            }}>
              <div className="font-mono" style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: '14px'
              }}>
                03 — THE CLOUD ATMOSPHERE
              </div>
              <h2 className="font-display" style={{
                fontSize: 'clamp(2.2rem, 4.6vw, 4.2rem)',
                lineHeight: 0.94,
                letterSpacing: '-0.03em',
                margin: '0 0 18px 0'
              }}>
                NO SCREENS. NO RUSH. JUST OPEN SKY.
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0
              }}>
                Every cloud chamber is tuned to the warmth of late-afternoon mountain sunlight—giving city residents a place to rest their eyes on a distant horizon and breathe clean, cool air.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 04: HOUSES & ARCHITECTURE */}
        <section
          id="houses"
          style={{
            padding: '40px 40px 120px 40px',
            maxWidth: '1280px',
            margin: '0 auto'
          }}
        >
          <div style={{
            backgroundColor: 'rgba(255, 253, 250, 0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(24, 23, 21, 0.08)',
            borderRadius: '18px',
            padding: 'clamp(32px, 5vw, 64px)',
            boxShadow: '0 24px 60px rgba(87, 75, 58, 0.06)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '48px'
            }}>
              <div>
                <div className="font-mono" style={{
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  color: '#78716c',
                  marginBottom: '14px'
                }}>
                  04 — ARCHITECTURAL NOTES
                </div>
                <h2 className="font-display" style={{
                  fontSize: 'clamp(2rem, 3.6vw, 3.2rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  color: '#181715',
                  margin: '0 0 20px 0'
                }}>
                  DESIGNED FOR STILLNESS.
                </h2>
                <p style={{
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: '#57534e',
                  margin: 0
                }}>
                  Built with natural stone, pure water vapor, and warm daylight optics so the body experiences the calm of standing above a mountain cloud inversion.
                </p>
              </div>

              <div>
                {[
                  ['CLOUD VAPOR', 'Pure, warm spring-water mist suspended in slow laminar currents'],
                  ['DAYLIGHT', 'Full-spectrum golden-hour sky calibrated to relax close-range eye strain'],
                  ['MATERIALS', 'Honed Icelandic basalt, shallow reflection pools, and untreated alpine cedar'],
                  ['SOUND', 'Naturally hushed rooms insulated from street traffic and urban vibration'],
                  ['GUEST POLICY', 'Small groups of up to six guests per hour; phones remain in the entry lockers']
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '24px',
                      padding: '18px 0',
                      borderBottom: '1px solid rgba(24, 23, 21, 0.1)',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span className="font-mono" style={{
                      fontSize: '11px',
                      color: '#78716c',
                      letterSpacing: '0.16em',
                      minWidth: '140px'
                    }}>
                      {label}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#181715',
                      flex: '1 1 240px',
                      lineHeight: 1.5
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 05: RESERVE A VISIT IN THE CLOUDS */}
        <section
          id="visit"
          style={{
            padding: '20px 40px 140px 40px',
            maxWidth: '1280px',
            margin: '0 auto'
          }}
        >
          <div style={{
            backgroundColor: 'rgba(255, 253, 250, 0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(24, 23, 21, 0.1)',
            borderRadius: '18px',
            padding: 'clamp(32px, 5vw, 64px)',
            boxShadow: '0 28px 70px rgba(87, 75, 58, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div>
              <div className="font-mono" style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: '#78716c',
                marginBottom: '14px'
              }}>
                05 — VISIT A CLOUD HOUSE
              </div>

              <h2 className="font-display" style={{
                fontSize: 'clamp(2rem, 3.8vw, 3.4rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: '#181715',
                margin: '0 0 20px 0'
              }}>
                SPEND AN HOUR IN THE CLOUDS.
              </h2>

              <p style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: '#57534e',
                margin: '0 0 28px 0'
              }}>
                Reserve a private 60-minute cloud passage in New York, Zurich, Tokyo, or Reykjavik, or inquire about architectural commissions for private residences.
              </p>

              <div style={{ marginBottom: '22px' }}>
                <div className="font-mono" style={{ fontSize: '10px', color: '#78716c', letterSpacing: '0.16em', marginBottom: '10px' }}>
                  SELECT HOUSE
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(['ZURICH', 'NEW YORK', 'TOKYO', 'REYKJAVIK'] as const).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => { setSelectedCity(city); setSubmitted(false); }}
                      className="font-mono"
                      style={{
                        padding: '9px 15px',
                        fontSize: '11px',
                        letterSpacing: '0.14em',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        border: selectedCity === city
                          ? '1px solid #181715'
                          : '1px solid rgba(24, 23, 21, 0.16)',
                        backgroundColor: selectedCity === city ? '#181715' : 'transparent',
                        color: selectedCity === city ? '#faf7f2' : '#3f3d39',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <div className="font-mono" style={{ fontSize: '10px', color: '#78716c', letterSpacing: '0.16em', marginBottom: '10px' }}>
                  ATMOSPHERE LIGHTING
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(['MORNING CLOUD', 'GOLDEN HOUR'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => { setTimeOfDay(mode); setSubmitted(false); }}
                      className="font-mono"
                      style={{
                        padding: '9px 15px',
                        fontSize: '11px',
                        letterSpacing: '0.14em',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        border: timeOfDay === mode
                          ? '1px solid #181715'
                          : '1px solid rgba(24, 23, 21, 0.16)',
                        backgroundColor: timeOfDay === mode ? '#181715' : 'transparent',
                        color: timeOfDay === mode ? '#faf7f2' : '#3f3d39',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {submitted ? (
                <div style={{
                  padding: '18px 20px',
                  border: '1px solid rgba(24, 23, 21, 0.2)',
                  borderRadius: '8px',
                  backgroundColor: '#f3eee6',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '12px',
                  color: '#181715',
                  letterSpacing: '0.08em',
                  lineHeight: 1.6
                }}>
                  INVITATION SENT TO {email.toUpperCase()} FOR THRESHOLD {selectedCity} ({timeOfDay}).
                </div>
              ) : (
                <form
                  onSubmit={handleFormSubmit}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="YOUR EMAIL ADDRESS"
                    className="font-mono"
                    style={{
                      flex: '1 1 220px',
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(24, 23, 21, 0.2)',
                      borderRadius: '6px',
                      color: '#181715',
                      padding: '14px 16px',
                      fontSize: '12px',
                      letterSpacing: '0.12em',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    className="font-mono"
                    style={{
                      backgroundColor: '#181715',
                      color: '#faf7f2',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '14px 24px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      cursor: 'pointer'
                    }}
                  >
                    REQUEST INVITATION →
                  </button>
                </form>
              )}
            </div>

            <div style={{
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 50px rgba(87, 75, 58, 0.12)'
            }}>
              <img
                src="/frames/frame_140.jpg?v=240"
                alt="Cloud Chamber interior atmosphere"
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </section>

        {/* Minimal Editorial Footer */}
        <footer style={{
          padding: '44px 40px',
          borderTop: '1px solid rgba(24, 23, 21, 0.1)',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div className="font-display" style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#181715' }}>
            THRESHOLD CLOUD SANCTUARIES
          </div>
          <div className="font-mono" style={{ fontSize: '11px', color: '#78716c', letterSpacing: '0.16em' }}>
            ZURICH · NEW YORK · TOKYO · REYKJAVIK
          </div>
        </footer>
      </main>
    </div>
  );
};
