import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Crum Blog - AI 기반 자동화 블로그",
  description: "AI 기반 자동 콘텐츠 생성과 트렌드 분석을 통해 최신 이슈와 정보를 제공하는 자동화 블로그",
  keywords: ["블로그", "AI", "자동화", "트렌드", "뉴스", "정보"],
  authors: [{ name: "Crum Blog Team" }],
  openGraph: {
    title: "Crum Blog - AI 기반 자동화 블로그",
    description: "AI 기반 자동 콘텐츠 생성과 트렌드 분석을 통해 최신 이슈와 정보를 제공하는 자동화 블로그",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crum Blog - AI 기반 자동화 블로그",
    description: "AI 기반 자동 콘텐츠 생성과 트렌드 분석을 통해 최신 이슈와 정보를 제공하는 자동화 블로그",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
