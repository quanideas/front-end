const ContainerWrapper = ({ children }) => {
    return (
        <section className="bg-gray-100 p-3 sm:p-5 sm:ml-12 md:ml-20 ld:ml-48 xl:ml-56">
            <div className="mx-auto max-w-screen-xl px-4 mt-16 pb-20">
                {children}
            </div>
        </section>
    );
};

export default ContainerWrapper;