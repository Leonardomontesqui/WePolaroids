import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, latitude, longitude, user, image_url } = req.body;

    // Validate the input data
    if (!title || !latitude || !longitude || !description) {
      return res.status(400).json({ message: 'Title, location, description, and coordinates are required.' });
    }

    // Insert issue into the Supabase table
    const { data, error } = await supabase
      .from('issues')
      .insert([{ title, description, latitude, longitude, user, image_url }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);  // Respond with the inserted data
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}