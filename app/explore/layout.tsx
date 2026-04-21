

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
        <main id="main-content" className="p-12">
            {children}
        </main>
    )
}