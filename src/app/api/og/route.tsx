import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #0a0f0a 0%, #0d1a0d 40%, #111f11 100%)',
                    fontFamily: 'system-ui, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circles */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-80px',
                        left: '-80px',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)',
                    }}
                />

                {/* Top accent line */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                    }}
                />

                {/* Main content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    {/* Brand Name */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '0px',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '72px',
                                fontWeight: 900,
                                color: '#ffffff',
                                letterSpacing: '-2px',
                            }}
                        >
                            TEHNIC
                        </span>
                        <span
                            style={{
                                fontSize: '72px',
                                fontWeight: 900,
                                color: '#22c55e',
                                letterSpacing: '-2px',
                            }}
                        >
                            AGRO
                        </span>
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: '22px',
                            color: '#a1a1aa',
                            fontWeight: 600,
                            letterSpacing: '8px',
                            textTransform: 'uppercase',
                        }}
                    >
                        SUPPLY
                    </div>

                    {/* Separator */}
                    <div
                        style={{
                            width: '80px',
                            height: '2px',
                            background: '#22c55e',
                            margin: '8px 0',
                        }}
                    />

                    {/* Description */}
                    <div
                        style={{
                            fontSize: '24px',
                            color: '#71717a',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <span>Utilaje Agricole No-Till</span>
                        <span style={{ color: '#22c55e' }}>•</span>
                        <span>Subvenții APIA 2026</span>
                    </div>
                </div>

                {/* Bottom domain */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        fontSize: '16px',
                        color: '#3f3f46',
                        fontWeight: 600,
                        letterSpacing: '4px',
                    }}
                >
                    tehnicagrosupply.ro
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
