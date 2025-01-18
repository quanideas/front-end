import Draggable from 'react-draggable';

const AddLabelForm = () => {
    return (
      <Draggable>
      <div className="fixed w-100 top-16 left-8 bg-white p-2 rounded shadow-lg max-w-sm text-center">
        <h2 className="text font-bold mb-2">Thêm chú thích</h2>
        <form>
          <div className="mb-4 text-left">
            <label htmlFor="name" className="block text-green-600 text-sm font-bold mb-2">Tiêu đề</label>
            <input type="text" id="name" name="name" className="w-full text-sm px-1 py-2 border border-gray-300 rounded" placeholder="Enter your name" />
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="message" className="block text-green-600 text-sm font-bold mb-2">Nội dung</label>
            <textarea id="message" name="message" className="w-full text-sm px-1 py-2 border border-gray-300 rounded" placeholder="Enter your message" rows="4"></textarea>
          </div>
          <button type="submit" className="bg-green-500 text-white py-2 px-4 text-sm rounded hover:bg-green-600 transition duration-200">THÊM</button>
        </form>
      </div>
      </Draggable>
      )
  };

  export default AddLabelForm;