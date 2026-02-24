export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <style>{`
                nav, header, footer { display: none !important; }
            `}</style>
            {children}
        </>
    );
}
