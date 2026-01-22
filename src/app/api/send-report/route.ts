import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
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
            from: `"Expertiza TehnicAgro" <${process.env.NODEMAILER_USER}>`,
            to: lead.email,
            subject: `Raport Audit Eficiență Tehnică - ${lead.name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #166534; color: white; padding: 32px; text-align: center;">
                        <h1 style="margin: 0; text-transform: uppercase; font-size: 24px; letter-spacing: 1px;">Audit de Eficiență Tehnologică</h1>
                        <p style="opacity: 0.8; margin-top: 8px;">Document Tehnic pentru ${lead.name}</p>
                    </div>
                    
                    <div style="padding: 32px; background-color: #ffffff;">
                        <h2 style="color: #111827; font-size: 18px; border-bottom: 2px solid #166534; padding-bottom: 8px;">Sumar Analiză - ${lead.hectares} HA</h2>
                        
                        <div style="margin: 24px 0;">
                            <p><strong>Culturile vizate:</strong> ${cropsList}</p>
                            <p><strong>Locație:</strong> Jud. ${lead.county}</p>
                        </div>

                        <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; border: 1px solid #f3f4f6;">
                            <h3 style="margin-top: 0; color: #166534; font-size: 16px;">Beneficii Spectate (Anual)</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: 12px; display: flex; justify-content: space-between;">
                                    <span>Securizare Subvenție PD-04:</span>
                                    <strong style="color: #166534;">${lead.subsidyIncome.toLocaleString('ro-RO')} RON</strong>
                                </li>
                                <li style="margin-bottom: 12px; display: flex; justify-content: space-between;">
                                    <span>Economie Carburant:</span>
                                    <strong style="color: #166534;">${lead.fuelSavings.toLocaleString('ro-RO')} RON</strong>
                                </li>
                                <li style="border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between; font-size: 18px;">
                                    <span><strong>Impact Total Profit:</strong></span>
                                    <strong style="color: #15803d;">${lead.totalBenefit.toLocaleString('ro-RO')} RON</strong>
                                </li>
                            </ul>
                        </div>

                        <div style="margin-top: 32px; padding: 20px; border-left: 4px solid #166534; background-color: #f0fdf4;">
                            <p style="margin: 0; font-size: 14px; color: #166534; font-weight: bold;">Verdict Expert Tehnologic:</p>
                            <p style="margin-top: 8px; font-size: 14px; color: #374151; line-height: 1.5;">
                                Configurația fermei dvs. este eligibilă pentru subvențiile 2026. Tehnologia propusă reduce cu peste 40% numărul de treceri mecanice.
                            </p>
                        </div>

                        <div style="margin-top: 32px; text-align: center;">
                            <p style="font-size: 13px; color: #6b7280; margin-bottom: 24px;">Un specialist TehnicAgro va reveni cu oferta tehnică detaliată și validarea finală.</p>
                            <a href="https://wa.me/40723380022" style="background-color: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; text-transform: uppercase; font-size: 14px;">Contactează Specialist WhatsApp</a>
                        </div>
                    </div>

                    <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af;">
                        &copy; 2026 TehnicAgro Supply - Partenerul tău pentru Eficiență Agricolă.
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
