import localFont from "next/font/local";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

export enum LsFontFamily {
    GeistSans = "var(--font-geist-sans), sans-serif",
    GeistMono = "var(--font-geist-mono), sans-serif",
}

export enum LsFontWeight {
    Light = '300',
    Medium = '500',
    Bold = '700',
}

export enum LsFontSize {
    Xxs = '10px',
    Xs = '12px',
    Sm = '14px',
    Base = '16px',
    Lg = '20px',
    Xl = '24px',
    Xxl = '32px',
}