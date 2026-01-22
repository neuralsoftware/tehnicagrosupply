import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { simpleRateLimit } from '@/lib/leads';

export async function POST(request: Request) {
    try {
        // Rate limiting for email sending (3 reports per hour per IP)
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const allowed = simpleRateLimit(`send-report:${ip}`, 3, 3600000); // 3 per hour

        if (!allowed) {
            return NextResponse.json(
                { error: 'Prea multe rapoarte solicitate. Încearcă din nou peste o oră.' },
                { status: 429 }
            );
        }

        const lead = await request.json();

        if (!lead.email) {
            return NextResponse.json({ error: 'No email provided' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        const cropsList = lead.crops?.join(', ') || 'Nespecificat';

        const mailOptions = {
            from: `"TehnicAgro Expert" <${process.env.NODEMAILER_USER}>`,
            replyTo: process.env.NODEMAILER_USER,
            to: lead.email,
            subject: `Expertiză Tehnică: Strategie Eficiență 2026 - ${lead.name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                        .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: #064e3b; color: #fff; padding: 40px 20px; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
                        .content { padding: 30px; }
                        .section-title { color: #065f46; border-bottom: 2px solid #065f46; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold; text-transform: uppercase; font-size: 16px; }
                        .lead-info { background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 6px; margin-bottom: 25px; }
                        .stat-grid { display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 25px; }
                        .stat-item { background: #fff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; }
                        .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; }
                        .stat-value { font-size: 20px; color: #065f46; font-weight: 800; margin-top: 5px; }
                        .benefit-card { background: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin-bottom: 25px; border-radius: 0 6px 6px 0; }
                        .benefit-card h3 { margin: 0 0 10px 0; color: #065f46; font-size: 18px; }
                        .detail-list { margin: 0; padding: 0; list-style: none; font-size: 14px; }
                        .detail-list li { margin-bottom: 8px; padding-left: 20px; position: relative; }
                        .detail-list li:before { content: "✓"; position: absolute; left: 0; color: #059669; font-weight: bold; }
                        .verdict { background: #fffbeb; border: 1px solid #fde68a; padding: 20px; border-radius: 8px; margin-top: 30px; }
                        .verdict h4 { margin: 0 0 10px 0; color: #92400e; text-transform: uppercase; font-size: 14px; }
                        .footer { background: #f3f4f6; color: #9ca3af; padding: 20px; text-align: center; font-size: 11px; }
                        .cta-button { display: inline-block; background: #059669; color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; text-transform: uppercase; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Raport Audit Tehnicagro</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Pregătit special pentru ${lead.name}</p>
                        </div>
                        
                        <div class="content">
                            <p>Bună ziua,</p>
                            <p>Vă mulțumim pentru interesul acordat tehnologiilor de precizie TehnicAgro. În urma datelor furnizate, specialiștii noștri au elaborat o diagnoză preliminară a eficienței pentru ferma dvs. din județul <strong>${lead.county}</strong>.</p>

                            <div class="section-title">Parametri Analiză: ${lead.hectares} HA</div>
                            
                            <div class="lead-info">
                                <ul style="list-style: none; padding: 0; font-size: 14px;">
                                    <li><strong>Culturi vizate:</strong> ${lead.crops?.join(', ') || 'Nespecificat'}</li>
                                    <li><strong>Orizont investiție:</strong> ${lead.urgency || 'Informativ'}</li>
                                    <li><strong>Locație:</strong> Jud. ${lead.county}</li>
                                </ul>
                            </div>

                            <div class="section-title">Impact Financiar Detaliat (Anual)</div>
                            
                            <div class="stat-grid">
                                <div class="stat-item">
                                    <div class="stat-label">Subvenție Securizată (PD-04)</div>
                                    <div class="stat-value">+${lead.subsidyIncome.toLocaleString('ro-RO')} RON</div>
                                    <p style="font-size: 11px; color: #6b7280; margin-top: 8px;">Calculat la un cuantum de 56.28 EUR/ha pentru agricultura conservativă.</p>
                                </div>
                                <div class="stat-item" style="margin-top: 15px;">
                                    <div class="stat-label">Economie directă Motorină</div>
                                    <div class="stat-value">+${lead.fuelSavings.toLocaleString('ro-RO')} RON</div>
                                    <p style="font-size: 11px; color: #6b7280; margin-top: 8px;">Bazat pe reducerea cu până la 40L/ha a consumului prin eliminarea trecerilor grele de prelucrare.</p>
                                </div>
                                <div class="stat-item" style="margin-top: 15px;">
                                    <div class="stat-label">Economie Input-uri (Precizie)</div>
                                    <div class="stat-value">+${(lead.totalBenefit - lead.subsidyIncome - lead.fuelSavings).toLocaleString('ro-RO')} RON</div>
                                    <p style="font-size: 11px; color: #6b7280; margin-top: 8px;">Reducerea risipei de semințe și îngrășăminte prin eliminarea suprapunerilor (estimat 10%).</p>
                                </div>
                            </div>

                            <div class="benefit-card">
                                <h3>Impact Total: ${lead.totalBenefit.toLocaleString('ro-RO')} RON / AN</h3>
                                <p style="font-size: 14px; margin: 0;">Această sumă reprezintă <strong>profit net suplimentar</strong> care poate acoperi rata pentru tehnologia nouă în proporție de peste 80%.</p>
                            </div>

                            <div class="verdict">
                                <h4>Verdict Tehnicagro Expert:</h4>
                                <p style="font-size: 14px; color: #4b5563; margin: 0; line-height: 1.5;">
                                    "${lead.name}, pentru culturile de <strong>${lead.crops?.[0] || 'cereale'}</strong> în județul ${lead.county}, tehnologia No-Till cu presiune mare pe brăzdar (min 150kg) este critică. Vă recomandăm o configurație care să asigure copierea perfectă a solului pentru a garanta răsărirea uniformă cerută de APIA."
                                </p>
                            </div>

                            <div style="text-align: center; margin-top: 40px;">
                                <a href="https://wa.me/40723380022" class="cta-button">Discută cu un Specialist</a>
                                <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">Sau răspundeți direct la acest email pentru a primi oferta comercială.</p>
                            </div>
                        </div>

                        <div class="footer">
                            <p>&copy; 2026 TehnicAgro Supply - Smart Efficiency Partner.</p>
                            <p>Această comunicare este un răspuns la solicitarea dvs. de audit tehnic.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
