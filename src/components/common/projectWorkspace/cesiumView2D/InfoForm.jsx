import React from 'react';

const InfoTable = ({ products }) => {
  return (
    <div className="relative overflow-x-auto text-sm font-bold shadow-md sm:rounded-lg">
      <div className="bg-gray-200 bg-opacity-95 p-2"> THÔNG TIN TÀI SẢN</div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="bg-white bg-opacity-85 border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-900 ">
                {product.key}
              </td>
              <td className="px-4 py-2 ">{product.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfoTable;