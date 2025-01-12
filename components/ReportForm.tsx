import React, { useState } from "react";

// Type for the form data
interface ReportFormProps {
  location: { lit: number; lat: number }; // Coordinates of the clicked location
  onSave: (formData: { title: string; description: string; image_url: string; type: string }) => void; // Save function
  onClose: () => void; // Close form function
}

export const ReportForm: React.FC<ReportFormProps> = ({ location, onSave, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save the form data by passing it to onSave function
    onSave({
      title,
      description,
      image_url: imageUrl,
      type,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-80">
      <h2 className="text-xl font-bold mb-4">Report a Location</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="block font-medium text-gray-700">Image URL</label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block font-medium text-gray-700">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Type</option>
            <option value="incident">Incident</option>
            <option value="event">Event</option>
            <option value="point of interest">Point of Interest</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
