'use client';

import { RoiCalculator } from '@/components/RoiCalculator';
import { LegislativeContextStack } from '@/components/LegislativeContextStack';

/** Banda 1: audit ROI + context legislativ, split pe același ecran. */
export function HomeAuditContextBand() {
    return (
        <section
            id="audit"
            className="border-b border-zinc-100 bg-white py-12 md:py-16"
            aria-labelledby="home-audit-legislative-heading"
        >
            <div className="mx-auto max-w-7xl px-4">
                <h2
                    id="home-audit-legislative-heading"
                    className="mb-6 text-center text-2xl font-semibold tracking-tight text-zinc-900 md:mb-8 md:text-3xl"
                >
                    Audit & context legislativ
                </h2>
                <div className="grid items-stretch gap-8 gap-y-10 md:grid-cols-2 lg:gap-10">
                    <div className="flex h-full min-h-0 min-w-0 flex-col">
                        <RoiCalculator embedded compact />
                    </div>
                    <div className="flex h-full min-h-0 min-w-0 flex-col">
                        <LegislativeContextStack />
                    </div>
                </div>
            </div>
        </section>
    );
}
