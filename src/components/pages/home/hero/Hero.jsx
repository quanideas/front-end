/**
 * Hero component renders a carousel with slides containing images and text content.
 * It includes navigation buttons to scroll through the slides and automatically scrolls to the next slide at intervals.
 * The component is responsive and adjusts its layout based on the window width.
 *
 * Features:
 * - Carousel with looping functionality.
 * - Automatic scrolling to the next slide at intervals.
 * - Responsive design with dynamic resizing.
 * - Localization support using next-i18next.
 * - Navigation buttons for manual slide control.
 *
 * @component
 * @example
 * return (
 *   <Hero />
 * )
 */

"use client";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/legacy/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import styles from "./hero.module.css";
import { useTranslation } from "next-i18next";

/**
 * PresentBlock component renders the content block for each slide.
 * It includes a title, description, and a button.
 *
 * @param {Object} props - Component props
 * @param {Array} props.content - Array of text lines to display in the content block
 * @returns {JSX.Element} The rendered PresentBlock component
 */
const PresentBlock = ({ content }) => {
  const { t } = useTranslation("public");  
  
  return (
    <div className="w-full px-8 xl:px-20 left-1/2">
      <div className="z-10 max-w-2xl mb-8 p-2 rounded-lg overflow-hidden bg-black bg-opacity-20 backdrop-blur-sm">
        <h1 className="text-2xl font-bold leading-snug tracking-tight text-gray-800 lg:text-3xl lg:leading-tight xl:text-5xl xl:leading-tight dark:text-gray">
          {t("hero.title")} <br /> 
          <span className="text-primary">IDEAS DRONE</span>
        </h1>
        <p className="py-5 text-md font-extralight lg:font-light leading-normal text-gray-100 lg:text-xl xl:text-2xl">
          {content.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
        <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
          <a
            href="/quotes"
            target="_blank"
            rel="noopener"
            className="p-2 lg:px-8 lg:py-4 lg:text-lg font-medium text-center text-white bg-primary rounded-md hover:bg-primary-hover"
          >
            {t("hero.book")}
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * Hero component renders a carousel with slides containing images and text content.
 * It includes navigation buttons to scroll through the slides and automatically scrolls to the next slide at intervals.
 * The component is responsive and adjusts its layout based on the window width.
 *
 * @component
 * @example
 * return (
 *   <Hero />
 * )
 */
function Hero() {
  const { t } = useTranslation("public");

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      if (!emblaApi.canScrollNext()) {
        emblaApi.scrollTo(0);
        return;
      }
      emblaApi.scrollNext();
    }, 50000); // 50000ms = 50 seconds

    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const models = [
    {
      id: 1,
      content: [
        t("hero.sub-title_1"),
        t("hero.sub-title_2"),
        t("hero.sub-title_3"),
      ],
      path: "/images/homepage/phantom4_RTK2.jpeg",
    },
    {
      id: 2,
      content: [t("hero.sub-title_4"), t("hero.sub-title_5")],
      path: "/images/homepage/phantom4_RTK3.jpeg",
    },
    {
      id: 3,
      content: [t("hero.sub-title_6")],
      path: "/images/homepage/mavic_pro_1.jpeg",
    },
  ];

  return (
    <div
      className={`${styles.embla} mx-auto h-[550px] xl:h-[900px]`}
      ref={emblaRef}
    >
      <div className={`${styles.embla__container} h-full`}>
        {models.map((model, index) => (
          <div
            key={model.id}
            className={`${
              styles.embla__slide
            } flex items-center justify-center main-banner item-${
              index + 1
            } object-cover relative`}
          >
            <Image
              src={model.path}
              alt={`Slide ${index + 1}`}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center main-banner item-1">
              <PresentBlock content={model.content} />
            </div>
          </div>
        ))}
      </div>
      {typeof scrollPrev === "function" && (
        <button
          onClick={scrollPrev}
          aria-label="Previous"
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-transparent border-none"
        >
          <ChevronLeftIcon className="h-10 w-18 text-primary" />
        </button>
      )}
      {typeof scrollNext === "function" && (
        <button
          onClick={scrollNext}
          aria-label="Next"
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-transparent border-none"
        >
          <ChevronRightIcon className="h-10 w-18 text-primary" />
        </button>
      )}
    </div>
  );
}

export default Hero;
