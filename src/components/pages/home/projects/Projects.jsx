/**
 * Projects component renders a carousel of project slides.
 * Each slide contains an image, title, and description of a project.
 * The component includes navigation buttons to scroll through the slides.
 * 
 * Features:
 * - Carousel with looping functionality.
 * - Responsive design with dynamic resizing.
 * - Localization support using next-i18next.
 * - Navigation buttons for manual slide control.
 * - Hover effects on project images.
 * 
 * @component
 * @example
 * return (
 *   <Projects />
 * )
 */

"use client"
import React from 'react'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react';
import styles from "./projects.module.css";
import Link from 'next/link';
import Container from "./Container";
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

const OPTIONS = { align: 'start' }

const Projects = () => {
  const { t } = useTranslation("public");
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const projects = [
    {
      title: t('projects.prj_3'),
      image: "/images/homepage/image_prj3.jpg",
      description: t('projects.more') + ">>"
    },
    // {
    //   title: t('projects.prj_5'),
    //   image: "/images/homepage/image_prj5.jpg",
    //   description: t('projects.more') + ">>"
    // },
    {
      title: t('projects.prj_6'),
      image: "/images/homepage/image_prj6.jpg",
      description: t('projects.more') + ">>"
    },
    // {
    //   title: t('projects.prj_4'),
    //   image: "/images/homepage/image_prj4.png",
    //   description: t('projects.more') + ">>"
    // },
    {
      title: t('projects.prj_2'),
      image: "/images/homepage/image_prj2.png",
      description: t('projects.more') + ">>"
    },
    {
      title: t('projects.prj_1'),
      image: "/images/homepage/image_prj1.jpg",
      description: t('projects.more') + ">>"
    },
    // Add more projects as needed
  ]

  return (
    <div className={`${styles.custom__bg__image}  bg-center xl:p-10`}>
      <Container>
        <div className="text-center text-2xl md:text-3xl xl:text-5xl py-6 px-10 rounded-t-xl xl:mb-4 font-semibold">
          <span className="text-white">{t('projects.title')} </span>
          <span className="text-primary">IDEAS DRONE</span>
        </div>
        <section className={`${styles.embla}`}>
          <div className={styles.embla__viewport} ref={emblaRef}>
            <div className={styles.embla__container}>
              {projects.map((project, index) => (
                <div className={styles.embla__slide} key={index}>
                  <div className={`${styles.item}`}>
                    <h4 className="text:sm font-extralight xl:font-semibold xl:text-xl flex-shrink md:h-16  xl:h-20 rounded-t-lg text-gray-100  py-3 px-3 bg-primary bg-opacity-50 backdrop-blur-sm">{project.title}</h4>
                    <Image height={400} width={600} className="rounded-b-lg  object-cover transform hover:scale-110 hover:rounded-lg transition-transform duration-500" title={project.title} alt={project.title} src={project.image} />
                    <p className="text-white font-light  py-4 hover:text-primary-hover">
                      <Link href="/projects">{project.description}</Link>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.embla__controls}>
            <div className={styles.embla__buttons}>
              <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
              <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>
          </div>
        </section>
      </Container>
    </div>
  )
};

export default Projects;