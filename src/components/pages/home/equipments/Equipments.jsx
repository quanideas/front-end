import Image from "next/legacy/image";
import Container from "./Container";
import { useTranslation } from 'next-i18next';

/**
 * Equipment component renders a list of equipment cards with images, titles, and descriptions.
 * It uses the `useTranslation` hook from `next-i18next` for internationalization.
 *
 * @component
 * @example
 * return (
 *   <Equipment />
 * )
 */
function Equipment() {
    const { t } = useTranslation("public");

    const cards = [
        {
            title: t('equipment.subtitle_1'),
            image: "/images/homepage/phantom4_RPK4.jpg",
            description: t('equipment.detail_1'),
        },
        {
            title: t('equipment.subtitle_2'),
            image: "/images/homepage/phantomPro4_1.jpg",
            description: t('equipment.detail_2'),
        },
        {
            title: t('equipment.subtitle_3'),
            image: "/images/homepage/mavic3.jpg",
            description: t('equipment.detail_3'),
        },
        // Add more card objects here...
    ];

    return (
        <div className="bg-gray-100">
            <Container>
                <div className="text-center text-2xl lg:text-3xl xl:text-5xl py-4 px-6 xl:py-8 xl:px-10  mb-4 font-semibold">
                    <span className="text-black ">{t('equipment.title')} </span>
                    <span className="text-primary">IDEAS-DRONE</span>
                </div>
                <div className="py-8">
                    <div className="flex flex-col ">
                        <div className="flex flex-wrap">
                            {cards.map((card, index) => (
                                <div key={index} className="phone:w-full w-full md:w-1/2 xl:w-1/3 px-4 mb-4">
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-2xl duration-500 group">
                                        <div className="relative w-full h-64 transform transition-transform duration-300 group-hover:scale-110">
                                            <Image alt="Card image cap" src={card.image} layout="fill" objectFit="cover" />
                                        </div>
                                        <div className="p-4">
                                            <h5 className="xl:text-xl xl:font-semibold mb-2">{card.title}</h5>
                                            {/* <h6 className="text-sm  text-gray-500 mb-2">{card.subtitle}</h6> */}
                                            <p className="text-gray-700 text-sm font-extralight xl:font-light lg:text-base lg:h-32 xl:mb-4">{card.description}</p>
                                            {/* <button className="bg-primary hidden lg:block hover:bg-primary-hover text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                                                {t('equipment.detail')}
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Equipment;
