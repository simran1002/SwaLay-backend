import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '@/dbConfig/dbConfig';
import Label, { ILabel } from '@/models/label'; // Adjust path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect(); // Connect to the database

  // Ensure the request method is DELETE
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Extract labelId from query parameters
  const { labelId } = req.query;

  try {
    // Validate labelId format
    if (!labelId || typeof labelId !== 'string') {
      return res.status(400).json({ message: 'Invalid labelId' });
    }

    // Attempt to delete label by labelId
    const deletedLabel = await Label.findByIdAndDelete(labelId);

    // Check if label was found and deleted
    if (!deletedLabel) {
      return res.status(404).json({ message: 'Label not found' });
    }

    // Return success message upon successful deletion
    res.json({ message: 'Label deleted successfully' });
  } catch (error: any) {
    // Handle server errors
    res.status(500).json({ message: error.message });
  }
}
