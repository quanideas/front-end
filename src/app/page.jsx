
"use client"
import Hero from "@/components/pages/home/hero/Hero";
import ShortInfo from "@/components/pages/home/intro/Intro";
import Project from "@/components/pages/home/projects/Projects";
import Service from "@/components/pages/home/services/Services";
import Equipment from "@/components/pages/home/equipments/Equipments";
import Contact from "@/components/pages/home/contact/Contact";
import SocialMediaIcons from "@/components/common/socialMedia/SocialMedia";
import HomeLayout from "@/components/layout/homeLayout/HomeLayout";

export default function Home() {
  return (
    <div>
      <HomeLayout>
          <Hero />
        <section id="short-info">
          <ShortInfo />
        </section>
        <section id="project">
          <Project />
        </section>
        <section id="service">
          <Service />
        </section>
        <section id="equipment">
          <Equipment />
        </section>
        <section id="contact">
          <Contact />
        </section>
        <SocialMediaIcons />
      </HomeLayout>
    </div>
  );
};

