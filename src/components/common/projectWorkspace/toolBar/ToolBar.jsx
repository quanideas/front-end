import Image from 'next/image';

const Toolbar = ({ setMode, mode }) => {
  return (
    <div className="fixed z-1 top-0 left-0 my-32 mx-3 flex flex-col bg-white rounded-md shadow-lg p-1 space-y-3">
      <button title="Measure Distance" className={`p-1 rounded border border-secondary ${mode === "distance" ? "bg-green-200" : "hover:bg-green-200"}`} onClick={() => setMode("distance")}>
        <Image src="/icons/common/measure.svg" alt="Measure Distance" width={24} height={24} />
      </button>
      <button className={`p-1 rounded border border-secondary ${mode === "polygon" ? "bg-green-200" : "hover:bg-green-200"}`} onClick={() => setMode("polygon")}>
        <Image src="/icons/common/polygon.svg" alt="Polygon" width={24} height={24} />
      </button>
      <button className={`p-1 rounded border border-secondary ${mode === "line" ? "bg-green-200" : "hover:bg-green-200"}`} onClick={() => setMode("line")}>
        <Image src="/icons/common/polyline.svg" alt="Line" width={24} height={24} />
      </button>
      <button className="p-1 hover:bg-green-200 rounded border border-secondary">
        <Image src="/icons/common/coordinates.svg" alt="Vector" width={24} height={24} />
      </button>
      <button className="p-1 hover:bg-green-200 rounded border border-secondary">
        <Image src="/icons/common/home.svg" alt="Home" width={24} height={24} />
      </button>
      <button className="p-1 hover:bg-green-200 rounded border border-secondary">
        <Image src="/icons/common/eraser.svg" alt="Trash" width={24} height={24} />
      </button>
    </div>
  );
};

export default Toolbar;