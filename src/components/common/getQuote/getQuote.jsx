// components/ContactForm.js

import React from 'react';
import { MdLocationOn, MdLocalPhone, MdEmail } from 'react-icons/md';

const GetQuote = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 p-6 pt-20 my-8 mx-52 rounded-lg">
      <div className="md:w-1/3 bg-green-400 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Liên hệ với chúng tôi để được hỗ trợ</h2>
        <p className="mb-4">Chúng tôi luôn sẵn sàng hỗ trợ bạn, gửi email hoặc liên hệ chúng tôi qua số điện thoại.</p>
        <div className="mb-4">
        <p className="flex items-center mb-2">
          <MdLocationOn className="mr-2" size={55} />
          Address: 198 West 21th Street, Suite 721 New York NY 10016
        </p>
        <p className="flex items-center mb-2">
          <MdLocalPhone className="mr-2" size={30} />
          Phone: + 1235 2355 98
        </p>
        <p className="flex items-center mb-2">
          <MdEmail className="mr-2" size={30} />
          Email: info@yoursite.com
        </p>

        </div>
      </div>
      <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md mt-6 md:mt-0 md:ml-6">
        <h3 className="text-xl font-bold mb-4">Liên hệ ngay</h3>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Tên đầy đủ</label>
              <input
                type="text"
                className="p-2 border border-gray-300 rounded"
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Địa chỉ email</label>
              <input
                type="email"
                className="p-2 border border-gray-300 rounded"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <label className="mb-2 font-semibold">Tiêu đề</label>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded"
              placeholder="Subject"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="mb-2 font-semibold">Nội dung</label>
            <textarea
              className="p-2 border border-gray-300 rounded h-24"
              placeholder="Message"
            />
          </div>
          <div className="flex justify-start mt-6">
            <button type="submit" className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetQuote;
