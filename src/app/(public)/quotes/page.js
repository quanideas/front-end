
"use client"
import Quotes from "@/components/pages/home/quotes/Quotes";
import HomeLayout from "@/components/layout/homeLayout/HomeLayout";

export default function Home() {
  return (
    <div>
      <HomeLayout>
        <Quotes/>
      </HomeLayout>
    </div>
  );
};

