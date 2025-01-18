import { Link as ScrollLink } from 'react-scroll';
import { useTranslation } from 'next-i18next';

const Links = ({ closeMenu }) => {
    const { t } = useTranslation("common");

    const links = [
        {
            title: t("navbarHome.about_us"),
            id: "short-info",
        },
        {
            title: t("navbarHome.projects"),
            id: "project",
        },
        {
            title: t("navbarHome.services"),
            id: "service",
        },
        {
            title: t("navbarHome.equipments"),
            id: "equipment",
        },
        {
            title: t("navbarHome.contact"),
            id: "contact",
        },
    ];

    return (
        <ul className="flex flex-col p-4 xl:p-0 mt-4 font-medium border border-gray-100 rounded-lg xl:space-x-8 rtl:space-x-reverse xl:flex-row xl:justify-center xl:mt-0 xl:border-0 ">
            {links.map(link => (
                <ScrollLink
                    key={link.title}
                    to={link.id}
                    smooth={true}
                    duration={500}
                    className="block text-gray-900 rounded hover:bg-gray-100 xl:hover:bg-transparent xl:hover:text-primary-hover xl:p-0"
                    activeClass="active"
                    spy={true} 
                    offset={-70} 
                    onClick={closeMenu} 
                >
                    {link.title}
                </ScrollLink>
            ))}
        </ul>
    );
};

export default Links;
