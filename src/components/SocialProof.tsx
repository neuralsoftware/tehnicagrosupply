'use client';

import { motion, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Users, TrendingUp, MapPin, Zap } from 'lucide-react';

const ROMANIAN_COUNTIES = [
    'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Botoșani', 'Brăila', 'Buzău',
    'Constanța', 'Călărași', 'Cluj', 'Dolj', 'Galați', 'Giurgiu', 'Gorj',
    'Ialomița', 'Iași', 'Mehedinți', 'Mureș', 'Olt', 'Prahova', 'Satu Mare',
    'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vrancea'
];

const ACTIVITY_MESSAGES = [
    'a solicitat un raport de eficiență',
    'a calculat economiile fermei',
    'a cerut ofertă Avers-Agro ADS',
    'a analizat rentabilitatea No-Till',
    'a solicitat informații APIA PD-04',
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        const controls = animate(0, target, {
            duration: 2,
            ease: 'easeOut',
            onUpdate: (v) => setDisplayValue(Math.round(v).toLocaleString('ro-RO')),
        });
        return () => controls.stop();
    }, [target]);

    return (
        <span className="text-4xl font-black text-ea-green-600 tabular-nums">
            {displayValue}{suffix}
        </span>
    );
}

function LiveActivityFeed() {
    const [activity, setActivity] = useState<{ county: string; message: string } | null>(null);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const showActivity = () => {
            const county = ROMANIAN_COUNTIES[Math.floor(Math.random() * ROMANIAN_COUNTIES.length)];
            const message = ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)];
            setActivity({ county, message });
            setVisible(true);

            setTimeout(() => setVisible(false), 4000);
        };

        // First one after 8 seconds
        timerRef.current = setTimeout(() => {
            showActivity();
            // Then every 15-25 seconds
            timerRef.current = setInterval(() => {
                showActivity();
            }, 15000 + Math.random() * 10000);
        }, 8000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className="fixed bottom-24 left-6 z-40 max-w-xs">
            {visible && activity && (
                <motion.div
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xl"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-ea-green-50 rounded-full flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-ea-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-800 font-medium">
                                Un fermier din <span className="text-ea-green-600 font-bold">{activity.county}</span>
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">{activity.message}</p>
                            <p className="text-[10px] text-zinc-400 mt-1">acum câteva momente</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export function SocialProof() {
    return (
        <section className="py-16 bg-zinc-50 border-y border-zinc-200">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ea-green-50 border border-ea-green-200 text-ea-green-600 text-xs font-black uppercase tracking-[0.2em]">
                        <Zap className="w-3 h-3" />
                        De Ce Ne Aleg Fermierii
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm"
                    >
                        <Users className="w-8 h-8 text-ea-green-600 mx-auto mb-3" />
                        <span className="text-4xl font-black text-ea-green-600">56</span>
                        <span className="text-xl font-black text-ea-green-700"> EUR/ha</span>
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mt-2">Subvenție APIA PD-04</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-center p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm"
                    >
                        <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <span className="text-4xl font-black text-blue-600">-40L</span>
                        <span className="text-xl font-black text-blue-700"> /ha</span>
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mt-2">Economie Motorină</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-center p-6 bg-white rounded-2xl border border-ea-green-200 shadow-sm"
                    >
                        <MapPin className="w-8 h-8 text-ea-green-600 mx-auto mb-3" />
                        <span className="text-4xl font-black text-ea-green-600">100%</span>
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mt-2">Eligibil GAEC 6</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
